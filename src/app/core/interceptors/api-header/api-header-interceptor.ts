import { HttpInterceptorFn } from '@angular/common/http';

export const apiHeaderInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
