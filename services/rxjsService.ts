import { BehaviorSubject, Observable, fromEvent, interval, merge, of } from 'rxjs';
import { map, filter, debounceTime, switchMap, catchError, takeUntil } from 'rxjs/operators';

// 创建一个BehaviorSubject来管理应用状态
export const appState$ = new BehaviorSubject<{
  isLoading: boolean;
  data: any;
  error: any;
}>({
  isLoading: false,
  data: null,
  error: null,
});

// 模拟API调用
export const fetchData = (id: string): Observable<any> => {
  return new Observable((observer) => {
    appState$.next({ ...appState$.value, isLoading: true });
    
    // 模拟网络延迟
    setTimeout(() => {
      const mockData = {
        id,
        title: `Item ${id}`,
        description: `This is item ${id}`,
        timestamp: new Date().toISOString(),
      };
      
      observer.next(mockData);
      appState$.next({ 
        ...appState$.value, 
        isLoading: false, 
        data: mockData 
      });
      observer.complete();
    }, 1000);
  });
};

// 搜索功能
export const searchService = {
  searchTerm$: new BehaviorSubject<string>(''),
  
  searchResults$: new BehaviorSubject<any[]>([]),
  
  // 防抖搜索
  search: (term: string) => {
    searchService.searchTerm$.next(term);
  },
  
  // 获取搜索结果流
  getSearchResults$: (): Observable<any[]> => {
    return searchService.searchTerm$.pipe(
      debounceTime(300),
      filter(term => term.length > 2),
      switchMap(term => {
        // 模拟搜索结果
        const results = Array.from({ length: 5 }, (_, i) => ({
          id: i + 1,
          title: `Search result ${i + 1} for "${term}"`,
          description: `Description for result ${i + 1}`,
        }));
        return of(results);
      })
    );
  }
};

// 定时器服务
export const timerService = {
  timer$: new BehaviorSubject<number>(0),
  
  startTimer: () => {
    const subscription = interval(1000).subscribe(value => {
      timerService.timer$.next(value);
    });
    return subscription;
  },
  
  stopTimer: (subscription: any) => {
    subscription?.unsubscribe();
  },
  
  resetTimer: () => {
    timerService.timer$.next(0);
  }
};

// 事件流服务
export const eventService = {
  // 合并多个事件流
  createEventStream: () => {
    const click$ = new BehaviorSubject(0);
    const input$ = new BehaviorSubject('');
    
    return merge(
      click$.pipe(map(count => ({ type: 'click', count }))),
      input$.pipe(map(value => ({ type: 'input', value })))
    );
  },
  
  // 错误处理示例
  handleError: <T>(source$: Observable<T>): Observable<T> => {
    return source$.pipe(
      catchError(error => {
        console.error('Error occurred:', error);
        return of(null as any);
      })
    );
  }
}; 