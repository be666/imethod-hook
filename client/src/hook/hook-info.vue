<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="am-panel am-panel-default">

    <div class="am-panel-hd">
      <h3 class="am-panel-title">
        Insert Hook
      </h3>
    </div>
    <div class="am-panel-bd">
      <form class="am-form am-form-horizontal"
            v-on:submit.prevent="submitForm"
            v-on:reset.prevent="reset">
        <fieldset>
          <legend>HookInfo</legend>
          <div class="am-form-group">
            <label class="am-u-sm-3 am-form-label">repositoryName</label>
            <div class="am-u-sm-9 am-u-end ">
              <input type="text" v-model="hook.repositoryName" required placeholder="">
            </div>
          </div>
          <div class="am-form-group">
            <label class="am-u-sm-3 am-form-label">directory</label>
            <div class="am-u-sm-9 am-u-end ">
              <input type="text" v-model="hook.directory" required placeholder="">
            </div>
          </div>
          <div class="am-form-group">
            <label class="am-u-sm-3 am-form-label">ref</label>
            <div class="am-u-sm-9 am-u-end ">
              <input type="text" v-model="hook.ref" required placeholder="">
            </div>
          </div>
          <div class="am-form-group">
            <label class="am-u-sm-3 am-form-label">pushCMD</label>
            <div class="am-u-sm-9 am-u-end ">
              <input type="text" v-model="hook.pushCMD" required placeholder="">
            </div>
          </div>
          <div class="am-form-group">
            <div class="am-u-sm-10 am-u-sm-offset-2">
              <button type="submit" class="am-btn am-btn-default">提交</button>
              <button type="reset" class="am-btn am-btn-default">取消&返回</button>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  </div>
</template>
<style lang='less'>
  .i-radio {
    display: inline-block;
    margin-right: 10px;
  }
</style>
<script type="text/javascript">
  export default {
    data () {
      return {
        hookId: this.$route.params.hookId,
        hook: {
          repositoryName: null,
          directory: null,
          ref: null,
          pushCMD: null
        }
      }
    },
    events: {
      refresh(){
        let $this = this;
        if (!this.hookId) {
          return
        }
        this.$http.get(this.$tools.resolveUrl(`/WebHooks/${this.hookId}`), function (res, ste, req) {
          $this.hook.repositoryName = res.repositoryName;
          $this.hook.directory = res.directory;
          $this.hook.ref = res.ref;
          $this.hook.pushCMD = res.pushCMD;
        }).error(function (res) {
          if (res.error) {
            $this.$dialog.error(res.error.message)
          }
        })
      },
      save(){

        let $this = this;
        this.$http.post(this.$tools.resolveUrl("/WebHooks"), {
          repositoryName: this.hook.repositoryName,
          directory: this.hook.directory,
          ref: this.hook.ref,
          pushCMD: this.hook.pushCMD
        }, function (res) {
          $this.$dispatch('link', "hook");
        }).error(function (res) {
          if (res.error) {
            $this.$dialog.error(res.error.message)
          }
        })
      },
      update(){

        let $this = this;
        this.$http.put(this.$tools.resolveUrl(`/WebHooks/${this.hookId}`), {
          repositoryName: this.hook.repositoryName,
          directory: this.hook.directory,
          ref: this.hook.ref,
          pushCMD: this.hook.pushCMD
        }, function (res) {
          $this.$dispatch('link', "hook");
        }).error(function (res) {
          if (res.error) {
            $this.$dialog.error(res.error.message)
          }
        })
      }
    },
    ready() {
      this.$dispatch('refresh')
    },
    methods: {
      submitForm(){
        if (!this.hookId) {
          this.$dispatch('save')
        } else {
          this.$dispatch('update')
        }

      },
      reset(){
        let $this = this;
        $this.$dispatch('link', 'hook')
      }
    },
    attached () {
    }
  }
</script>
