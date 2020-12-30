<template>
  <div>
    <el-header height="112px">
      <el-image src="http://www.filipposciarrone.org/moocs/loghi.jpg" fit="fill"></el-image>
      <span>{{titolo}}</span>
    </el-header>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "header-component",
  data: function() {
    return {
      titolo: "K-OpenAnswer System"
    };
  }
};
</script>

<style type="text/css" scoped>
.el-header {
  background-color: #409EFF;
  color: rgb(255, 255, 255);
  text-align: center;
  line-height: 112px;
  font-size: 32px;
}
.el-image{
  float: right;
  padding: 12px;
}
</style>