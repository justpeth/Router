"# Router"  兼容到ie7

使用方法：
1、 设置路由
  a、单纯的设置路由：
        Router.path("#/a");
  b、设置带不确定参数的路由
        Router.path("#/a/:id").done(function () {
            alert(this.params.id);   //  this.params.id 为参数
            操作代码
        });
        Router.path("#/a/:id/:ids").done(function () {
                    alert(this.params.id);   //  this.params.id 为参数id
                    alert(this.params.ids);   //  this.params.ids 为参数ids
                    操作代码

                });
  c、设置根路由  如果网址没有hash值或者hash值为#/时  默认的路由
        Router.root("#/b");   // 默认执行#/b 路由的done函数
  d、如果网址hash是没有定义的路由  此时执行的函数
        Router.rescue(function(){
                操作代码
            });
  e、路由器启动
        Router.init();  无其他参数