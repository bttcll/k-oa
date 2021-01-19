<template>
  <div>
    <el-main v-loading="loading" element-loading-text="Loading...">
      <p>
        This function load a MOOC from a file.
        <br />The file format is a text format representing the adjacency
        matrix of the MOOC.
        <br />When loading the MOOC, for each
        student the SM is created.
      </p>

      <el-card class="box-card" shadow="hover">
        <div slot="header" class="clearfix">
          <span>Import MOOC from a saved txt file</span>
        </div>
        <el-button type="primary" class="fileContainer" icon="el-icon-upload">
          <input type="file" @change="loadTextFromFile" accept=".txt" />
          Load
        </el-button>
      </el-card>
    </el-main>
  </div>
</template>

<script type="text/javascript">
import { mapState, mapMutations } from "vuex";

export default {
  data: function() {
    return {
      loading: false
    };
  },

  computed: mapState(["NUMSTUDENTI"]),

  methods: {
    ...mapMutations(["resetAll", "RiempiGrafo"]),

    loadTextFromFile(ev) {
      //cancello lo stato
      this.resetAll();

      const file = ev.target.files[0];
      const reader = new FileReader();

      // limite a 5000 studenti
      // stampo qualcosa non va, altrimenti faccio la funzione

      reader.onload = e => {
        const fromComponent = {
          // functionN: 2,
          file: e.target.result
        };

        // INIZIO CARICAMENTO
        //MESSAGGIO DI BUILD
        this.$message("Peer-assessment time...");
        this.loading = true;

        setTimeout(() => {
          // FUNZIONE + TUTTO OK O NO
          this.RiempiGrafo(fromComponent);
          if (this.NUMSTUDENTI) {
            this.$message({
              message: "Congrats, MOOC loaded.",
              type: "success"
            });
          }
          // OH NO QUALCOSA NON E ANDATO
          else {
            this.$message({
              message: "Something went wrong.",
              type: "error"
            });
          }
          this.loading = false;
        }, 500);
      };
      reader.readAsText(file);
    }
  }
};
</script>

<style type="text/css" scoped>
.fileContainer {
  overflow: hidden;
  position: relative;
  width: 350px;
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
