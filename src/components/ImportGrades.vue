<template>
  <div>
    <el-main v-loading="loading" element-loading-text="Loading...">
      <p>
        By this module, the user can
        upload a teacher distribution previously created.
        <br />In our
        study we uploaded one of a set of normal distributions
        built by means of the previous module.
        <br />
        <br />Please select a txt file.
      </p>

      <el-card class="box-card" shadow="hover">
        <div slot="header" class="clearfix">
          <span>Import Teacher Grades</span>
        </div>
        <el-button type="primary" class="fileContainer" icon="el-icon-upload">
          <input type="file" @change="loadTextFromFile" accept=".txt" />
          Load
        </el-button>

        <el-button v-on:click="$emit('tabSelected', 'home-component')">Cancel</el-button>
      </el-card>
    </el-main>
  </div>
</template>

<script type="text/javascript">
export default {
  data: function() {
    return {
      loading: false
    };
  },

  methods: {
    loadTextFromFile(ev) {
      const file = ev.target.files[0];
      const reader = new FileReader();

      // limite a 5000 studenti
      if (file.size > 50012507) {
        const fromComponent = {
          functionN: 8,
          file: null
        };
        this.loading = true;
        setTimeout(() => this.$emit("componentEvent", fromComponent), 500);
      } else {
        reader.onload = e => {
          const fromComponent = {
            functionN: 8,
            file: e.target.result
          };
          this.loading = true;
          setTimeout(() => this.$emit("componentEvent", fromComponent), 500);
        };
        reader.readAsText(file);
      }
    }
  }
};
</script>

<style type="text/css" scoped>
.fileContainer {
  overflow: hidden;
  position: relative;
}

.inputButton {
  width: 400px;
  height: 200px;
}

.fileContainer [type="file"] {
  cursor: inherit;
  display: block;
  font-size: 999px;
  filter: alpha(opacity=0);
  opacity: 0;
  position: absolute;
  right: 0;
  text-align: right;
  top: 0;
}

.box-card {
  width: 400px;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
</style>
