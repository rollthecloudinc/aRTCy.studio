import { Injectable } from "@angular/core";
import { iif, Observable, of } from "rxjs";
import { AliasRedirectHandler } from 'alias';
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { PanelPage } from "../models/panels.models";
import { EntityServices } from "@ngrx/data";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlMatcher, UrlSegment, UrlSegmentGroup, UrlTree } from '@angular/router';
import { PanelsPageRouterComponent } from '../components/panels-page-router/panels-page-router.component';
import { HttpParams } from "@angular/common/http";
import * as qs from 'qs'

@Injectable()
export class PanelsRedirectHandler implements AliasRedirectHandler {
  siteName = 'ipe'
  get panelPageListItemsService() {
    return this.es.getEntityCollectionService('PanelPageListItem');
  }
  constructor(
    private es: EntityServices,
    private router: Router
    // siteName: string
  ) {
    // this.siteName = siteName;
  }

  redirect(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const matchPathQuery = 'path=' + state.url.substr(1).split('/').reduce<Array<string>>((p, c, i) => [ ...p, i === 0 ?  `/${c}`  :  `${p[i-1]}/${c}` ], []).join('&path=') + `&site=${encodeURIComponent(this.siteName)}`;
    this.panelPageListItemsService.getWithQuery(matchPathQuery).pipe(
      map(pages => pages.reduce((p, c) => p === undefined ? c : p.path.split('/').length < c.path.split('/').length ? c : p , undefined)),
      map(panelPage => {
        const argPath = state.url.substr(1).split('/').slice(panelPage.path.split('/').length - 1).join('/');
        return [panelPage, argPath];
      })
    ).subscribe(([panelPage, argPath]) => {
      // this.router.onSameUrlNavigation.reload;
      // this.router.navigate(['reload']);
      console.log(`nagigvate to: ${panelPage.path}${argPath === '' ? '' : `/${argPath}`}?${qs.stringify(route.queryParams)}`);
      this.router.navigateByUrl(`${panelPage.path}${argPath === '' ? '' : `/${argPath}`}?${qs.stringify(route.queryParams)}`, {queryParams: { ...((route as ActivatedRouteSnapshot).queryParams) }, fragment: (route as ActivatedRouteSnapshot).fragment })
    });
  }

}