<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="i-panel i-grew-h">
    <div class="i-panel-header">
      Insert Hook
    </div>
    <div class="i-panel-body">
      <form class="i-form"
            v-on:submit.prevent="submitForm"
            v-on:reset.prevent="reset">
        <fieldset>
          <legend>HookInfo</legend>
          <div class="i-row">
            <label class="i-col-3 i-text-al-r">repositoryName</label>
            <input type="text"
                   class="i-col-9"
                   v-model="hook.repositoryName" required placeholder="">
          </div>
          <div class="i-row">
            <label class="i-col-3 i-text-al-r">directory</label>
            <input type="text"
                   class="i-col-9"
                   v-model="hook.directory" required placeholder="">
          </div>
          <div class="i-row">
            <label class="i-col-3 i-text-al-r">ref</label>
            <input type="text" class="i-col-9" v-model="hook.ref" required placeholder="">
          </div>
          <div class="i-row">
            <label class="i-col-3 i-text-al-r">pushCMD</label>
            <input type="text" class="i-col-9" v-model="hook.pushCMD" required placeholder="">
          </div>
          <div class="i-text-al-c ">
            <div class="i-btn-g i-in-flex">
              <button type="submit">提交</button>
              <button type="reset">取消&返回</button>
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
