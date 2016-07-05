let {Vue} = require("../common");
let VueRouter = require('vue-router');
//main

Vue.use(VueRouter);

let App = Vue.extend({
  events: {
    link: function (pathName, params) {
      router.go({
        name: pathName,
        params: params || {}
      })
    }
  }
});

let router = new VueRouter();
router.map({
  '/': {
    name: "root",
    component: require("../layout/root.vue"),
    subRoutes: {
      "/": {
        component: require("../layout/app.vue"),
        subRoutes: {
          "hook": {
            name: "hook",
            component: require("./hook.vue")
          },
          "hook/insert": {
            name: "hook-add",
            component: require("./hook-info.vue")
          },
          "hook/:hookId": {
            name: "hook-info",
            component: require("./hook-info.vue")
          }
        }
      }
    }
  }
});

router.redirect({
  "/": "/hook"
});

router.beforeEach(function (transition) {
  let $this = transition.to.router.app;
  return   transition.next();
  if ($this.$tools.inArray($this.$auth.ignore, transition.to.path)) {
    transition.next()
  } else {
    $this.$auth.valid($this, function () {
      transition.next();
    }, function () {
      transition.redirect("/login")
    });
  }
});

router.start(App, 'body');
