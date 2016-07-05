<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="am-panel am-panel-default">
    <div class="am-panel-hd">
      <h3 class="am-panel-title">
        hookList
      </h3>
    </div>
    <div class="am-panel-bd">
      <div class="am-btn-toolbar">
        <div class="am-btn-group">
          <div class="am-btn am-btn-default"
               v-on:click="hookAdd()">
            新增
          </div>
        </div>
      </div>
      <div class="am-panel-bd">
        <i_table
          v-on:table-click="optionInfo"
          v-on:table-page-click="pageClick"
          v-ref:table
        ></i_table>
      </div>
    </div>
  </div>
</template>
<style>

</style>
<script>

  export default{
    data(){
      return {
        pageIndex: 1,
        pageSize: 10,
        keyWord: null
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
      refresh (pageIndex, pageSize) {
        var $this = this;
        if (pageIndex) {
          $this.pageIndex = pageIndex;
        }
        pageIndex = $this.pageIndex;
        if (pageSize) {
          $this.pageSize = pageSize;
        }
        pageSize = $this.pageSize;
        let query = {};

        $this.$http.get($this.$tools.resolveUrl("/WebHooks/count"), {
          where: query
        }, function (res, ste, req) {
          let totalRow = res.count;
          let totalPage = $this.$tools.getTotalPage(totalRow, pageSize);
          $this.$refs.table.dataList = [];
          if (totalPage > 0 && totalPage < pageIndex) {
            pageIndex = totalPage;
          }
          let pages = $this.$tools.getPages(totalPage, pageIndex);
          $this.$http.get($this.$tools.resolveUrl("/WebHooks"), {
            filter: {
              where: query,
              order: ['id DESC'],
              include: [
                {}
              ],
              skip: (pageIndex - 1) * pageSize,
              limit: pageSize
            }
          }, function (res, ste, req) {
            $this.$refs.table.dataList = res;
            let rowCount = $this.$refs.table.dataList.length;
            this.$refs.table.pageMaker = {
              pageIndex: pageIndex,
              pageSize: pageSize,
              totalPage: totalPage,
              pages: pages,
              rowCount: rowCount,
              sizes: totalRow
            }
          })
        })
      }
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
        }
      ];
      $this.$refs.table.optionList = [
        {
          className: 'am-btn-sm',
          id: "hook",
          render: function (el, index) {
            return '编辑';
          }
        }
      ];
    }
  }
</script>
