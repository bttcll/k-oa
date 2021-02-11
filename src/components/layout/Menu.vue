<template>
  <div>
    <el-aside width="200px">
      <el-menu default-active="0">
        <el-menu-item
          index="0"
          v-on:click="$emit('tabSelected', 'home-component')"
        >
          <i class="el-icon-s-home" />
          <span>Home</span>
        </el-menu-item>

        <el-menu-item
          index="8"
          v-on:click="$emit('tabSelected', 'instructions-component')"
        >
          <i class="el-icon-question" />
          <span>Help</span>
        </el-menu-item>

        <el-menu-item index="1" v-on:click="$emit('tabSelected', 'load-mooc')">
          <i class="el-icon-upload" />
          <span>Load an old MOOC</span>
        </el-menu-item>

        <el-menu-item index="2" v-on:click="$emit('tabSelected', 'build-mooc')">
          <i class="el-icon-magic-stick" />
          <span>Build a new MOOC</span>
        </el-menu-item>
		
		<el-menu-item index="2" v-on:click="$emit('tabSelected', 'build-mooc')">
          <i class="el-icon-magic-stick" />
          <span>Start a PA Session</span>
        </el-menu-item>

        <el-menu-item
          index="3"
          v-bind:disabled="isButtonDisabled"
          v-on:click="$emit('tabSelected', 'students-all')"
        >
          <i class="el-icon-user" />
          <span>View MOOC</span>
        </el-menu-item>

        <!-- <el-menu-item
          index="4"
          v-bind:disabled="isButtonDisabled"
          v-on:click="$emit('tabSelected', 'import-grades')"
        >
          <i class="el-icon-medal" />
          <span>Import Teacher Grades</span>
        </el-menu-item> -->

        <el-menu-item
          index="5"
          v-bind:disabled="knnButton"
          v-on:click="$emit('tabSelected', 'knn-component')"
        >
          <i class="el-icon-s-tools" />
          <span>MOOC's learning</span>
        </el-menu-item>

        <el-menu-item
          index="6"
          v-bind:disabled="isButtonDisabled"
          v-on:click="$emit('tabSelected', 'chart-component')"
        >
          <i class="el-icon-data-line" />
          <span>Charts &amp; Stats</span>
        </el-menu-item>

        <el-menu-item
          index="7"
          v-bind:disabled="isButtonDisabled"
          v-on:click="$emit('tabSelected', 'export-component')"
        >
          <i class="el-icon-download" />
          <span>Export MOOC</span>
        </el-menu-item>
        <el-menu-item
          index="8"
          v-on:click="$emit('tabSelected', 'session-component')"
        >
          <i class="el-icon-switch-button" />
          <span>Session</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
  </div>
</template>

<script type="text/javascript">
import { mapState } from "vuex";

export default {
  name: "menu-component",

  computed: {
    // VARIABILI DALLO STATO
    ...mapState(["NUMSTUDENTI", "NumeroCore"]),

    isButtonDisabled: function () {
      if (this.NUMSTUDENTI) return false;
      else return true;
    },
    knnButton: function () {
      if (this.NumeroCore > 2) return false;
      else return true;
    },
  },
};
</script>

<style type="text/css" scoped>
.el-aside {
  /*background-color: #D3DCE6;*/
  color: #333;
  text-align: left;
  line-height: 30px;
  height: 100%;
}
.el-menu {
  height: 100%;
}

span {
  color: #409eff;
  font-size: 15px;
}
</style>