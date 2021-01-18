<template>
  <div id="app">
    <el-container>
      <menu-cp v-on:tabSelected="tabSelected" />
      <el-container>
        <header-cp />
        <component v-bind:is="currentTabComponent" />

        <el-footer />
      </el-container>
    </el-container>
  </div>
</template>

<script>
import HeaderCp from "./components/layout/Header";
import MenuCp from "./components/layout/Menu";
import HomeComponent from "./components/HomeComponent";
import InstructionsComponent from "./components/InstructionsComponent";
import BuildMooc from "./components/BuildMooc";
import LoadMooc from "./components/LoadMooc";
import StudentsAll from "./components/StudentsAll";
import ChartComponent from "./components/ChartComponent";
import KnnComponent from "./components/KnnComponent";
import ExportComponent from "./components/ExportComponent";
import SessionComponent from "./components/SessionComponent";
// import ImportGrades from "./components/ImportGrades";

export default {
  name: "app",
  components: {
    HeaderCp,
    MenuCp,
    BuildMooc,
    HomeComponent,
    InstructionsComponent,
    LoadMooc,
    StudentsAll,
    ChartComponent,
    KnnComponent,
    ExportComponent,
    SessionComponent
    // ImportGrades
  },
  data() {
    return {
      currentTab: "home-component",
      loading: false
    };
  },
  computed: {
    currentTabComponent() {
      return this.currentTab;
    }
  },
  methods: {
    tabSelected(sel) {
      return (this.currentTab = sel);
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
