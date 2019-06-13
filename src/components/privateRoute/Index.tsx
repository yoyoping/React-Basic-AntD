/*
 * @Description: 路由组件
 * @Author: your name
 * @Date: 2019-05-30 19:58:00
 * @LastEditTime: 2019-06-11 20:32:09
 * @LastEditors: Please set LastEditors
 */
/**
 * 通过判断登录、权限 动态生成Route
 */
import React, { useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import RouteMap from '../../route/Route'

import NotFound from '../../pages/error/NotFound'
import NoPermissions from '../../pages/error/NoPermissions'

const PrivateRoute: React.FC<any> = props => {
  const [token] = useState(sessionStorage.getItem('token')) // 获取当前是否登录
  const [auth] = useState<any | null>(sessionStorage.getItem('auth')) // 获取当前权限
  return (
    <Switch>
      {
        // 动态生成路由
        RouteMap.map((item, index) => {
          return <Route
            key={index}
            path={item.path}
            exact
            render={props => { // 渲染route
              const _redirect: string | null = item.redirect ? item.redirect : ''
              if (_redirect) {
                return <Redirect
                  to={{
                    pathname: _redirect,
                    state: { from: props.location }
                  }}
                />
              }
              if (!item.needLogin) { // 不需要登录
                return <item.component {...props} />
              } else { // 需要登录
                if (token) { // 已登录
                  if (!item.auth) { // 没有权限限制
                    return <item.component {...props} />
                  } else { // 有权限限制
                    let _arr: string[] = [];
                    if (_arr.includes(auth)) { // 拥有权限
                      return <item.component {...props} />
                    } else { // 未拥有权限
                      // 重定向到未拥有权限页
                      return <Redirect
                        to={{
                          pathname: '/noPermissions',
                          state: { from: props.location }
                        }}
                      />
                    }
                  }
                } else { // 未登录
                  // 重定向到登录页
                  return <Redirect
                    to={{
                      pathname: '/login',
                      state: { from: props.location }
                    }}
                  />
                }
              }
            }}
          />
        })
      }
      {/* 未拥有权限路由 */}
      <Route path="/noPermissions" exact component={NoPermissions} />
      {/* 404 页面未找到路由 */}
      {
        // 判断没找到页面地址如果未登录就跳转到登录，如果已登录就404
        <Route component={NotFound} />
      }
    </Switch>
  )
}

export default PrivateRoute
