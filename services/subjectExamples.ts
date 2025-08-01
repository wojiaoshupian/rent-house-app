import { 
  Subject, 
  BehaviorSubject, 
  ReplaySubject, 
  AsyncSubject,
  Observable,
  fromEvent,
  merge
} from 'rxjs';
import { map, filter, debounceTime, takeUntil, share } from 'rxjs/operators';

// ==================== 1. Subject - 基础多播 ====================
export class EventBusService {
  private eventSubject = new Subject<{ type: string; payload: any }>();

  // 发送事件
  emit(type: string, payload: any) {
    this.eventSubject.next({ type, payload });
  }

  // 监听特定类型的事件
  on(eventType: string): Observable<any> {
    return this.eventSubject.pipe(
      filter(event => event.type === eventType),
      map(event => event.payload)
    );
  }

  // 用途示例：
  // eventBus.emit('user-login', { userId: 123 });
  // eventBus.on('user-login').subscribe(data => console.log('用户登录:', data));
}

// ==================== 2. BehaviorSubject - 状态管理 ====================
export class AppStateService {
  // 用户状态管理
  private userState$ = new BehaviorSubject<{
    isAuthenticated: boolean;
    user: any;
    permissions: string[];
  }>({
    isAuthenticated: false,
    user: null,
    permissions: []
  });

  // 主题状态管理
  private themeState$ = new BehaviorSubject<{
    isDark: boolean;
    primaryColor: string;
  }>({
    isDark: false,
    primaryColor: '#3b82f6'
  });

  // 加载状态管理
  private loadingState$ = new BehaviorSubject<{
    [key: string]: boolean;
  }>({});

  // 获取当前用户状态
  getUserState() {
    return this.userState$.asObservable();
  }

  // 更新用户状态
  updateUserState(newState: Partial<typeof this.userState$.value>) {
    this.userState$.next({ ...this.userState$.value, ...newState });
  }

  // 获取当前主题
  getTheme() {
    return this.themeState$.asObservable();
  }

  // 切换主题
  toggleTheme() {
    const current = this.themeState$.value;
    this.themeState$.next({ ...current, isDark: !current.isDark });
  }

  // 设置加载状态
  setLoading(key: string, isLoading: boolean) {
    const current = this.loadingState$.value;
    this.loadingState$.next({ ...current, [key]: isLoading });
  }

  // 获取加载状态
  getLoading(key: string): Observable<boolean> {
    return this.loadingState$.pipe(
      map(state => state[key] || false)
    );
  }
}

// ==================== 3. ReplaySubject - 历史记录 ====================
export class HistoryService {
  // 保留最近10个操作
  private actionHistory$ = new ReplaySubject<{
    action: string;
    timestamp: Date;
    data: any;
  }>(10);

  // 保留最近5个错误
  private errorHistory$ = new ReplaySubject<{
    error: string;
    timestamp: Date;
    context: any;
  }>(5);

  // 记录操作
  recordAction(action: string, data: any) {
    this.actionHistory$.next({
      action,
      timestamp: new Date(),
      data
    });
  }

  // 记录错误
  recordError(error: string, context: any) {
    this.errorHistory$.next({
      error,
      timestamp: new Date(),
      context
    });
  }

  // 获取操作历史
  getActionHistory() {
    return this.actionHistory$.asObservable();
  }

  // 获取错误历史
  getErrorHistory() {
    return this.errorHistory$.asObservable();
  }

  // 用途示例：
  // historyService.recordAction('user-login', { userId: 123 });
  // historyService.getActionHistory().subscribe(history => console.log('操作历史:', history));
}

// ==================== 4. AsyncSubject - 最终结果 ====================
export class TaskService {
  // 执行长时间任务，只关心最终结果
  executeTask(taskName: string): Observable<any> {
    const asyncSubject = new AsyncSubject<any>();

    // 模拟长时间任务
    setTimeout(() => {
      // 可能有多个中间结果，但只有最后一个会被发送
      asyncSubject.next('中间结果1');
      asyncSubject.next('中间结果2');
      asyncSubject.next('最终结果'); // 只有这个会被订阅者接收到
      asyncSubject.complete(); // 必须调用 complete() 才会发送值
    }, 2000);

    return asyncSubject.asObservable();
  }

  // 批量处理任务
  processBatch(items: any[]): Observable<any> {
    const asyncSubject = new AsyncSubject<any>();

    // 处理每个项目
    items.forEach((item, index) => {
      setTimeout(() => {
        const result = `处理完成: ${item}`;
        asyncSubject.next(result);
        
        // 如果是最后一个项目，完成处理
        if (index === items.length - 1) {
          asyncSubject.complete();
        }
      }, (index + 1) * 500);
    });

    return asyncSubject.asObservable();
  }
}

// ==================== 5. 实际应用场景组合 ====================
export class NotificationService {
  // 即时通知 (Subject)
  private notifications$ = new Subject<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: Date;
  }>();

  // 通知历史 (ReplaySubject)
  private notificationHistory$ = new ReplaySubject<any>(50);

  // 未读通知计数 (BehaviorSubject)
  private unreadCount$ = new BehaviorSubject<number>(0);

  // 发送通知
  notify(type: 'success' | 'error' | 'warning' | 'info', message: string) {
    const notification = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date()
    };

    this.notifications$.next(notification);
    this.notificationHistory$.next(notification);
    
    // 更新未读计数
    const currentCount = this.unreadCount$.value;
    this.unreadCount$.next(currentCount + 1);
  }

  // 获取实时通知流
  getNotifications() {
    return this.notifications$.asObservable();
  }

  // 获取通知历史
  getHistory() {
    return this.notificationHistory$.asObservable();
  }

  // 获取未读计数
  getUnreadCount() {
    return this.unreadCount$.asObservable();
  }

  // 标记为已读
  markAsRead() {
    this.unreadCount$.next(0);
  }
}

// ==================== 6. 搜索服务增强版 ====================
export class SearchService {
  private searchTerm$ = new BehaviorSubject<string>('');
  private searchResults$ = new BehaviorSubject<any[]>([]);
  private searchHistory$ = new ReplaySubject<string>(10);
  private isSearching$ = new BehaviorSubject<boolean>(false);

  // 执行搜索
  search(term: string) {
    this.searchTerm$.next(term);
    if (term.trim()) {
      this.searchHistory$.next(term);
    }
  }

  // 获取搜索结果流（带防抖）
  getSearchResults$(): Observable<any[]> {
    return this.searchTerm$.pipe(
      debounceTime(300),
      filter(term => term.length > 2),
      map(term => {
        this.isSearching$.next(true);
        // 模拟搜索
        const results = Array.from({ length: 5 }, (_, i) => ({
          id: i + 1,
          title: `搜索结果 ${i + 1} for "${term}"`,
          description: `描述 ${i + 1}`
        }));
        this.isSearching$.next(false);
        this.searchResults$.next(results);
        return results;
      })
    );
  }

  // 获取搜索历史
  getSearchHistory() {
    return this.searchHistory$.asObservable();
  }

  // 获取搜索状态
  getSearchingState() {
    return this.isSearching$.asObservable();
  }
}

// 导出服务实例
export const eventBus = new EventBusService();
export const appState = new AppStateService();
export const historyService = new HistoryService();
export const taskService = new TaskService();
export const notificationService = new NotificationService();
export const searchService = new SearchService();
