<template>
  <div>
    <el-main>
      <p>
        This module allows to export some
        MOOC variables by txt and CSV files. In particular, one can export all
        the SMs, i.e., K, J and DEV together with other variables,
        in group or separated. Thanks to this function, one can check
        the MOOC dynamic by statistical programs like the R program
        allowing for a more in-depth study as well. Moreover this module can exports the MOOC’s graphs
        into a dot format, ready to be visualized by the Graphvitz
        Grafo visualization environment.
      </p>

      <el-card class="box-card" shadow="hover">
        <div slot="header" class="clearfix">
          <span>Select files to download</span>
        </div>

        <el-select v-model="value" placeholder="Select">
          <el-option-group v-for="group in options" :key="group.label" :label="group.label">
            <el-option
              v-for="item in group.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-option-group>
        </el-select>&nbsp;
        <el-button type="primary" icon="el-icon-download" @click="download">Download</el-button>
      </el-card>
    </el-main>
  </div>
</template>

<script type="text/javascript">
import { mapState } from "vuex";

export default {
  name: "export",

  data: function() {
    return {
      options: [
        {
          label: "TXT export",
          options: [
            {
              value: 1,
              label: "(K,J)"
            },
            {
              value: 2,
              label: "(K, J, Dev)"
            },
            {
              value: 9,
              label: "Delta"
            }
          ]
        },
        {
          label: "CSV export",
          options: [
            {
              value: 3,
              label: "K csv"
            },
            {
              value: 4,
              label: "J csv"
            },
            {
              value: 5,
              label: "Dev csv"
            },
            {
              value: 6,
              label: "Teacher Grades csv"
            }
          ]
        },
        {
          label: "Dot for Graphvitz",
          options: [
            {
              value: 7,
              label: "Dot file"
            }
          ]
        }
      ],
      value: ""
    };
  },

  computed: mapState([
    "classe",
    "Grafo",
    "TeacherGrades",
    "NUMSTUDENTI",
    "NUMSTUDENTIVOTATI"
  ]),

  methods: {
    download: function() {
      //per il salvataggio su txt
      var data = "";
      var blob;
      var FileSaver = require("file-saver");

      switch (this.value) {
        case 1:
          data += "K, J\n";
          for (let i = 0; i < this.NUMSTUDENTI; i++) {
            data += this.classe[i].k + ", ";
            data += this.classe[i].j + "\n";
          }
          //salvo il file in locale
          blob = new Blob([data], { type: "text/plain;charset=utf-8" });
          FileSaver.saveAs(blob, "k_j.txt");
          break;

        case 2:
          data += "K, J, Dev\n";
          for (let i = 0; i < this.NUMSTUDENTI; i++) {
            data += this.classe[i].k + ", ";
            data += this.classe[i].j + ", ";
            data += this.classe[i].dev + "\n";
          }
          //salvo il file in locale
          blob = new Blob([data], { type: "text/plain;charset=utf-8" });
          FileSaver.saveAs(blob, "k_j_dev.txt");
          break;

        case 3:
          for (let i = 0; i < this.NUMSTUDENTI; i++)
            data += this.classe[i].k + "\n";
          //salvo il file in locale
          blob = new Blob([data], { type: "text/plain;charset=utf-8" });
          FileSaver.saveAs(blob, "k.csv");
          break;

        case 4:
          for (let i = 0; i < this.NUMSTUDENTI; i++)
            data += this.classe[i].j + "\n";
          //salvo il file in locale
          blob = new Blob([data], { type: "text/plain;charset=utf-8" });
          FileSaver.saveAs(blob, "j.csv");
          break;

        case 5:
          for (let i = 0; i < this.NUMSTUDENTI; i++)
            data += this.classe[i].dev + "\n";
          //salvo il file in locale
          blob = new Blob([data], { type: "text/plain;charset=utf-8" });
          FileSaver.saveAs(blob, "dev.csv");
          break;

        case 6:
          for (let i = 0; i < this.NUMSTUDENTI - 1; i++)
            data += this.classe[i].dev.toFixed(1) + ",";
          data += this.TeacherGrades[this.NUMSTUDENTI - 1].toFixed(1);
          //salvo il file in locale
          blob = new Blob([data], { type: "text/plain;charset=utf-8" });
          FileSaver.saveAs(blob, "TeacherGrades.csv");
          break;

        case 7:
          var c = '"';
          data += "digraph G {\n";
          for (let i = 0; i < this.NUMSTUDENTI; i++) {
            for (let j = 0; j < this.NUMSTUDENTI; j++) {
              if (this.Grafo[i][j] != 0)
                data +=
                  c +
                  "S" +
                  i +
                  c +
                  "->" +
                  c +
                  "S" +
                  j +
                  c +
                  " [label=" +
                  this.Grafo[i][j].toFixed(1) +
                  "];\n";
            }
          }
          data += "}";
          blob = new Blob([data], { type: "text/plain;charset=utf-8" });
          FileSaver.saveAs(
            blob,
            "graph_" + this.NUMSTUDENTI + "_" + this.NUMSTUDENTIVOTATI + ".dot"
          );
          break;

        case 9:
          for (let i = 0; i < this.NUMSTUDENTI; i++)
            data += this.classe[i].delta + "\n";
          //salvo il file in locale
          blob = new Blob([data], { type: "text/plain;charset=utf-8" });
          FileSaver.saveAs(blob, "delta.txt");
          break;

        default:
          console.log("qualcosa non va");
      }
    }
  }
};
</script>

<style type="text/css" scoped>
.box-card {
  width: 400px;
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