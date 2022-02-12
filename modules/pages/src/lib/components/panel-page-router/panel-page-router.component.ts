import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { getSelectors, RouterReducerState } from '@ngrx/router-store';
import { EntityServices, EntityCollectionService } from '@ngrx/data';
import { PanelPage, PageBuilderFacade, PanelPageStateSlice } from 'panels';
import { map, filter, distinctUntilChanged, switchMap, withLatestFrom, tap, take, delay } from 'rxjs/operators';
import { AsyncApiCallHelperService } from 'utils';

@Component({
  selector: 'classifieds-ui-panel-page-router',
  templateUrl: './panel-page-router.component.html',
  styleUrls: ['./panel-page-router.component.scss']
})
export class PanelPageRouterComponent implements OnInit {

  panelPageId: string;

  private panelPageService: EntityCollectionService<PanelPage>;

  constructor(
    private route: ActivatedRoute,
    private pageBuilderFacade: PageBuilderFacade,
    private routerStore: Store<RouterReducerState>,
    private asyncApiCallHelperSvc: AsyncApiCallHelperService,
    es: EntityServices
  ) {
    this.panelPageService = es.getEntityCollectionService('PanelPage');
  }

  ngOnInit(): void {
    //console.log(`route page page: ${this.panelPageId}`);
    const { selectCurrentRoute } = getSelectors((state: any) => state.router);
    this.route.paramMap.pipe(
      tap(() => console.log('param map panelPageId')),
      map(p => p.get('panelPageId')),
      filter(id => id !== undefined),
      distinctUntilChanged(),
      tap(() => console.log('panel page router before page getByKey')),
      // @todo: This universal rendering...
      tap(id => console.log(`matched id: ${id}`)),
      tap(id => this.panelPageId = id),
      switchMap(id => /*this.asyncApiCallHelperSvc.doTask(*/this.panelPageService.getByKey(id).toPromise()/*)*/),
      tap(() => console.log('panel page router after page getByKey')),
      withLatestFrom(this.routerStore.pipe(
        select(selectCurrentRoute),
        map(route => route.params),
        take(1)
      ))
    ).subscribe(([panelPage, args]) => {
      console.log(`panel page object`, panelPage);
      console.log('route page');
      const realPath = '/pages/panelpage/' + panelPage.id;
      this.pageBuilderFacade.setPageInfo(new PanelPageStateSlice({ id: panelPage.id, realPath, path: panelPage.path, args }));
      // this.panelPageId = panelPage.id;
    });
    this.route.paramMap.pipe(
      tap(() => console.log('param map page builder facade info')),
      withLatestFrom(this.pageBuilderFacade.getPageInfo$),
      filter(([p, pageInfo]) => pageInfo !== undefined && p.get('panelPageId') !== undefined && p.get('panelPageId') === pageInfo.id),
      switchMap(([p, pageInfo]) => this.routerStore.pipe(
        select(selectCurrentRoute),
        map(route => [pageInfo, route.params]),
        take(1)
      ))
    ).subscribe(([pageInfo, args]) => {
      //console.log('update page info');
      this.pageBuilderFacade.setPageInfo(new PanelPageStateSlice({ ...pageInfo, args }));
    });
  }

}
