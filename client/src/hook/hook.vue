<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="i-panel">
    <div class="i-panel-header">
      hookList
    </div>
    <div class="i-panel-body">
      <div class="i-btn-g">
        <button
          v-on:click="hookAdd()"
        >
          新增
        </button>
      </div>
      <i_table_server
        v-on:table-click="optionInfo"
        v-bind:query="query"
        v-bind:where="where"
        v-on:table-page-click="pageClick"
        page-size="10"
        page-index="1"
        v-bind:data-url="dataUrl"
        v-bind:count-url="countUrl"
        v-ref:table
      >
      </i_table_server>
    </div>
  </div>
</template>
<style>

</style>
<script>

  export default{
    data(){
      let $this = this;
      return {
        dataUrl: $this.$tools.resolveUrl(`/WebHooks?filter[limit]={pageSize}&filter[skip]={pageSkip}`),
        countUrl: $this.$tools.resolveUrl(`/WebHooks/count`),
        query: {
          filter: {
            order: ['id DESC'],
            include: [
            ]
          }
        },
        where:{

        }
      }
    },
    ready () {
      this.$dispatch('refresh');
    },
    methods: {
      link (pathName, params) {
        this.$dispatch('link', pathName, params);
      },
      optionInfo (pid, oid, data) {
        var $this = this;
        if (oid == 'hook') {
          let hookId = data.id;
          $this.$dispatch('link', 'hook-info', {
            hookId: hookId
          });
        }
      },
      hookAdd(){
        this.$dispatch('link', 'hook-add');
      },
      pageClick(pageIndex, pageSize){
        this.$dispatch('refresh', pageIndex, pageSize)
      },
      searched(){
        this.$dispatch('refresh', 1, this.pageSize)
      }
    },
    events: {

    },
    compiled () {
      var $this = this;
      $this.$refs.table.pk = 'id';
      $this.$refs.table.checkbox = [];
      $this.$refs.table.titleList = [
        {
          id: "repositoryName",
          text: "repositoryName"
        },
        {
          id: "ref",
          text: "ref"
        },
        {
          id: "directory",
          text: "directory"
        },
        {
          id: "pushCMD",
          text: "pushCMD"
        },
        {
          id: "id",
          text: "编辑",
          className: 'i-t-center',
          render(el, attr, index){
            return `<div class="i-btn-g"><button data-option="hook">编辑</button></div>`
          }
        }
      ];
    }
  }
</script>
