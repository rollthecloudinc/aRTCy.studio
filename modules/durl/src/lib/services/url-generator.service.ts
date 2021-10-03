import { Injectable } from '@angular/core';
import { getSelectors, RouterReducerState } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { Param, ParamPluginManager, ParamPlugin } from 'dparam';
import { Observable, of, forkJoin, iif } from 'rxjs';
import { map, switchMap, defaultIfEmpty, tap, } from 'rxjs/operators';
import * as qs from 'qs';
@Injectable({
  providedIn: 'root'
})
export class UrlGeneratorService {

  constructor(
    private routerStore: Store<RouterReducerState>,
    private paramPluginManager: ParamPluginManager
  ) {}

  getUrl(url, params: Array<Param>, metadata: Map<string, any>): Observable<string> {
    const { selectCurrentRoute } = getSelectors((state: any) => state.router);
    return this.routerStore.pipe(
      select(selectCurrentRoute),
      map(route => [route, url, url.indexOf('?')]),
      map(([route, url, index]) => [route, (index > -1 ? url.substring(0, index) : url), (index > -1 ? url.substring(index + 1) : '')]),
      switchMap(([route, path, queryString]) => {
        const qsParsed = qs.parse(queryString);
        const pathPieces: Array<string> = path.split('/');
        const meta = new Map<string, any>([ ...metadata, ['_route', route] ]);
        const paramNames = this.paramNames(url);
        const mappings = params.reduce<Map<string, Param>>((p, c, i) => new Map([ ...p, [paramNames[i], c ] ]), new Map<string, Param>());
        const path$ = pathPieces.reduce<Array<Observable<string>>>((p, c, i) => {
          if(c.indexOf(':') === 0) {
            return [ ...p, this.paramValue(mappings.get(c/*.substr(1)*/), meta)];
          } else {
            return [ ...p, of(pathPieces[i])];
          }
        }, []);
        const qs$: Array<Observable<[string, any, boolean]>> = [];
        for(const prop in qsParsed) {
          if(Array.isArray(qsParsed[prop])) {
            qsParsed[prop].forEach(p => qs$.push(this.paramValue(mappings.get(p), meta).pipe(map(v => [prop, v, true]))));
          } else if(typeof(qsParsed[prop]) === 'string' && qsParsed[prop].indexOf(':') > -1) {
            qs$.push(this.paramValue(mappings.get(qsParsed[prop]/*.substr(1)*/), meta).pipe(map(v => [prop, v, false])));
          } else {
            qs$.push(of([prop, qsParsed[prop], Array.isArray(qsParsed[prop])]));
          }
        }
        return forkJoin([
          forkJoin(path$).pipe(
            map(p => p.join('/')),
            defaultIfEmpty(path)
          ),
          forkJoin(qs$).pipe(
            tap(q => console.log(q)),
            map(q => q.reduce((p, [n, v, m]) => {
              if(v === undefined || v === null || v === '') {
                return p;
              } else {
                return ( m ? { ...p, [n]: [ ...( p[n] !== undefined ? p[n] : [] ) , v ] } : { ...p, [n]: v } );
              }
            }, this.rebuildQueryString(qsParsed))),
            tap(q => console.log(q)),
            map(q => qs.stringify(q, { arrayFormat: 'repeat', indices: false })),
            defaultIfEmpty(queryString)
          )
        ]).pipe(
          map(r => r.join('?')),
        );
      })
    );
  }

  paramNames(url: string): Array<string> {
    const indexPos = url.indexOf('?');
    const pathParsed = ((indexPos > -1 ? url.substring(0, indexPos) : url) as string).split('/').reduce<any>((p, c, i) => (c.indexOf(':') === 0 ? { ...p, [c.substr(1)]: c } : p ), {});
    const parsed = { ...pathParsed, ...qs.parse(url.substring(url.indexOf('?') + 1)) };
    const paramNames = [];
    for(const param in parsed) {
      if(Array.isArray(parsed[param])) {
        parsed[param].forEach(p => paramNames.push(p));
      } else if(parsed[param].indexOf(':') === 0) {
        paramNames.push(parsed[param]);
      }
    }
    return paramNames;
  }

  paramValue(param: Param, metadata: Map<string, any>): Observable<string> {
    return this.paramPluginManager.getPlugins().pipe(
      map<Map<string, ParamPlugin<string>>, [string, ParamPlugin<string>]>(plugins => Array.from(plugins).find(([_, p]) => (p.condition && p.condition({ param, metadata }) || (!p.condition && p.id === param.mapping.type)))),
      map<[string, ParamPlugin<string>], ParamPlugin<string>>(([_, p]) => p),
      switchMap<ParamPlugin<string>, Observable<any>>(p => p.evalParam({ param, metadata }))
    );
  }

  rebuildQueryString(q: any): any {
    const newQ = {};
    for(const p in q) {
      if(Array.isArray(q[p])) {
        newQ[p] = [];
      } else {
        newQ[p] = p[q];
      }
    }
    return qs.parse(newQ);
  }

}