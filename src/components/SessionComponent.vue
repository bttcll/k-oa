<template>
  <div>
    <el-main v-loading="loading" element-loading-text="Loading...">
      <table align="center">
        <caption>
          <p>SESSION MANAGEMENT</p>
        </caption>
        <tr>
          <td>
            <el-card class="box-card" shadow="hover">
              <div class="text item" align="center">
                <h1>Resume an old session</h1>
                <input
                  id="selectedFile"
                  type="file"
                  @change="loadTextFromFile"
                  style="display: none"
                />
                <el-button
                  type="primary"
                  icon="el-icon-upload2"
                  onclick="document.getElementById('selectedFile').click();"
                  style="width: 100px; height: 100px; font-size: 20px"
                  circle
                ></el-button>
              </div>
            </el-card>
          </td>

          <td>
            <el-card class="box-card" shadow="hover">
              <div class="text item" align="center">
                <h1>Save the current session and quit</h1>
                <el-button
                  type="danger"
                  icon="el-icon-switch-button"
                  style="width: 100px; height: 100px; font-size: 20px"
                  @click="saveSession()"
                  circle
                ></el-button>
              </div>
            </el-card>
          </td>
        </tr>
      </table>
    </el-main>
  </div>
</template>

<script type="text/javascript">
import { mapState, mapMutations } from "vuex";

export default {
  name: "session-component",
  data: function () {
    return {
      loading: false,
    };
  },

  computed: mapState(["NUMSTUDENTI"]),

  methods: {
    ...mapMutations(["resetAll", "RiempiGrafo", "saveAll", "loadAll"]),

    saveSession: function () {
      this.loading = true;
      setTimeout(() => {
        this.saveAll();
        this.loading = false;
      }, 500);

      // reload page
      setTimeout(() => {
        window.location.reload(true);
      }, 1000);
    },

    loadTextFromFile(ev) {
      //cancello lo stato
      this.resetAll();

      const file = ev.target.files[0];
      const reader = new FileReader();

      // limite a 5000 studenti
      // stampo qualcosa non va, altrimenti faccio la funzione

      reader.onload = (e) => {
        // INIZIO CARICAMENTO
        //MESSAGGIO DI BUILD
        this.$message("Loading session...");
        this.loading = true;

        setTimeout(() => {
          // FUNZIONE + TUTTO OK O NO
          this.loadAll(e.target.result);

          if (this.NUMSTUDENTI) {
            this.$message({
              message: "Congrats, session loaded.",
              type: "success",
            });
          }
          // OH NO QUALCOSA NON E ANDATO
          else {
            this.$message({
              message: "Something went wrong.",
              type: "error",
            });
          }
          this.loading = false;
        }, 500);
      };
      reader.readAsText(file);
    },
  },
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
