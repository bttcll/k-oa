<template>
  <div>
    <el-main v-loading="loading" element-loading-text="Loading...">
      <div>
        <h1>
          3D Plot &nbsp;
          <el-switch v-model="value1" v-on:change="tredplot"></el-switch>
        </h1>

        <div v-if="value2" align="center">
          <Plotly
            :data="dataKJDev"
            :layout="layoutKJdev"
            :display-mode-bar="false"
          />
        </div>

        <table v-if="!value2">
          <tr>
            <td>
              <el-card class="box-card" shadow="hover">
                <div slot="header" class="clearfix">
                  <big>Some stats</big>
                </div>

                <div class="text item">
                  <b>Compare Distributions Peers-Teacher</b>

                  <ul style="list-style-type: circle">
                    <li>CoreNumber: {{ NumeroCore }}</li>
                    <br />
                    <li>TeacherAverage: {{ mediaProf }}</li>
                    <br />
                    <li>TeacherDifference: {{ scartoProf }}</li>
                    <br />
                    <li>StudentsAverage: {{ mediaStud }}</li>
                    <br />
                    <li>StudentsDifference: {{ scartoStud }}</li>
                    <br />
                    <!-- <li>Delta: {{delta}} </li><br /> -->
                    <!-- <li>Delta Peers-Teacher real: {{deltaR}} </li> -->
                    <li>Delta: {{ deltaR }}</li>
                  </ul>

                  <b>Distances between teacher and student distributions</b>
                  <ul style="list-style-type: circle">
                    <li>K Distance: {{ sumK }}</li>
                    <br />
                    <li>J Distance: {{ sumJ }}</li>
                  </ul>
                </div>
              </el-card>
            </td>

            <td>
              <Plotly
                :data="dataK"
                :layout="layoutK"
                :display-mode-bar="false"
              />
            </td>
          </tr>

          <tr>
            <td>
              <Plotly
                :data="dataKT"
                :layout="layoutKT"
                :display-mode-bar="false"
              />
            </td>
            <td>
              <Plotly
                :data="dataKJ"
                :layout="layoutKJ"
                :display-mode-bar="false"
              />
            </td>
          </tr>
          <tr>
            <td>
              <Plotly
                :data="dataDev"
                :layout="layoutDev"
                :display-mode-bar="false"
              />
            </td>
            <td>
              <Plotly
                :data="dataDelta"
                :layout="layoutDelta"
                :display-mode-bar="false"
              />
            </td>
          </tr>
        </table>
      </div>

      <Plotly :data="dataPT" :layout="layoutPT" :display-mode-bar="false" />
    </el-main>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Plotly } from "vue-plotly";

export default {
  components: {
    Plotly,
  },

  //funzioni per il calcolo della statistica fanno riferimento a {{}}
  computed: {
    ...mapState(["classe", "NUMSTUDENTI", "NumeroCore", "TeacherGrades"]),

    mediaProf: function () {
      var i, somma;
      somma = 0;

      if (!this.NumeroCore) return 0;

      for (i = 0; i < this.NUMSTUDENTI; i++) {
        if (this.classe[i].stato) somma += this.classe[i].kTeacher;
      }
      return Number.parseFloat(somma / this.NumeroCore).toPrecision(4);
    },

    scartoProf: function () {
      var i, somma;
      somma = 0;

      if (!this.NumeroCore) return 0;

      for (i = 0; i < this.NUMSTUDENTI; i++) {
        if (this.classe[i].stato)
          somma += Math.pow(this.classe[i].kTeacher - this.mediaProf, 2);
      }
      return Number.parseFloat(Math.sqrt(somma / this.NumeroCore)).toPrecision(
        4
      );
    },

    mediaStud: function () {
      //calcoli per tutti gli studenti
      var i, somma;
      somma = 0;
      // studenti
      for (i = 0; i < this.NUMSTUDENTI; i++) {
        //if(this.classe[i].stato==NO_CORE)
        somma += this.classe[i].k;
      }
      //mediaStud=somma/(NUMSTUDENTI-NumeroCore);
      return Number.parseFloat(somma / this.NUMSTUDENTI).toPrecision(4);
    },

    scartoStud: function () {
      var i, somma;
      somma = 0;

      for (i = 0; i < this.NUMSTUDENTI; i++) {
        //if(this.classe[i].stato==NO_CORE)
        somma += Math.pow(this.classe[i].k - this.mediaStud, 2);
      }

      //scartoStud=sqrt(somma/(NUMSTUDENTI-NumeroCore));
      return Number.parseFloat(Math.sqrt(somma / this.NUMSTUDENTI)).toPrecision(
        4
      );
    },

    delta: function () {
      var delta, i;
      delta = 0;
      for (i = 0; i < this.NUMSTUDENTI; i++) {
        delta += Math.pow(this.classe[i].k - this.classe[i].kt, 2);
      }
      return Number.parseFloat(delta).toPrecision(4);
    },

    deltaR: function () {
      return Number.parseFloat(
        Math.sqrt(this.delta / this.NUMSTUDENTI)
      ).toPrecision(4);
    },

    sumK: function () {
      var i, sumK;
      sumK = 0;

      for (i = 0; i < this.NUMSTUDENTI; i++)
        sumK += Math.pow(this.classe[i].k - this.classe[i].kt, 2);

      return Number.parseFloat(Math.sqrt(sumK / this.NUMSTUDENTI)).toPrecision(
        4
      );
    },

    sumJ: function () {
      var i, sumJ;
      sumJ = 0;

      for (i = 0; i < this.NUMSTUDENTI; i++)
        sumJ += Math.pow(this.classe[i].j - this.classe[i].jt, 2);

      return Number.parseFloat(Math.sqrt(sumJ / this.NUMSTUDENTI)).toPrecision(
        4
      );
    },
  },

  data: function () {
    return {
      value1: false,
      value2: false,
      loading: false,

      dataDelta: [
        {
          type: "indicator",
          mode: "gauge+number+delta",
          value: 0,
          delta: { reference: 1 },
          gauge: {
            axis: { range: [0, 5], tickwidth: 1, tickcolor: "darkblue" },
            bar: { color: "#409EFF" },
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "gray",
            steps: [
              { range: [0, 1], color: "#67C23A5C" },
              { range: [1, 3.5], color: "#E6A23C40" },
              { range: [3.5, 5], color: "#F56C6C42" },
            ],
            threshold: {
              line: { color: "red", width: 4 },
              thickness: 0.75,
              value: 4.8,
            },
          },
        },
      ],

      layoutDelta: {
        title: "KP Vs. KT Delta Indicator",
        width: 400,
        height: 400,
      },

      dataKJ: [
        {
          x: [],
          y: [],
          mode: "markers",
          type: "scatter",
          name: "Team A",
          marker: {
            color: "#409EFF",
          },
        },
      ],

      layoutKJ: {
        title: "(KP,JP) Distribution",
        hoverlabel: {
          bgcolor: "#FFF",
        },
        xaxis: {
          title: "KP",
          range: [0.1, 10.2],
        },
        yaxis: {
          title: "JP",
          range: [-0.1, 1.1],
        },
        height: 400,
        width: 400,
      },

      dataDev: [
        {
          values: [],
          labels: [
            "Dev(0 - 0,99): ",
            "Dev(1 - 1,99):",
            "Dev(2 - 2,99):",
            "Dev(3 - 3,99):",
            "Dev(4 - +inf):",
          ],
          type: "pie",
          textinfo: "label+percent",
          textposition: "outside",
          hoverlabel: {
            bgcolor: "white",
          },
          marker: {
            colors: ["#409EFF", "#67C23A", "#E6A23C", "#F56C6C", "#909399"],
          },
          automargin: true,
        },
      ],

      layoutDev: {
        title: "Grades RMSD Distribution",
        height: 400,
        width: 400,
        showlegend: false,
      },

      dataK: [
        {
          x: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
          y: [],
          name: "",
          marker: {
            color: "#409EFF",
          },
          type: "bar",
        },
      ],

      dataKT: [
        {
          x: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
          y: [],
          name: "",
          marker: {
            color: "#409EFF",
          },
          type: "bar",
        },
      ],

      layoutK: {
        title: "Peer Assessment Distribution",
        hoverlabel: {
          bgcolor: "#FFF",
        },
        xaxis: {
          title: "Peer Assessment (KP)",
        },
        yaxis: {
          title: "Frequency",
          range: [0, 1],
        },
        height: 400,
        width: 400,
      },

      layoutKT: {
        title: "Teacher Grades Distribution",
        hoverlabel: {
          bgcolor: "#FFF",
        },
        xaxis: {
          title: "Teacher’s Grades (KR)",
        },
        yaxis: {
          title: "Frequency",
          range: [0, 1],
        },
        height: 400,
        width: 400,
      },

      dataPT: [
        {
          x: [],
          y: [],
          name: "Distance ",
          type: "scatter",
          mode: "markers",
          marker: { color: "#409EFF" },
        },
      ],

      layoutPT: {
        title: "KP Vs. KT Grades Distance",
        hoverlabel: {
          bgcolor: "#FFF",
        },
        xaxis: {
          title: "Students",
        },
        yaxis: {
          title: "JP",
          range: [0, 10],
        },
      },

      dataKJDev: [
        {
          x: [],
          y: [],
          z: [],
          name: "",
          hovertemplate: "K: %{x}" + "<br />J: %{y}" + "<br />Dev: %{z}",
          mode: "markers",
          marker: {
            size: 5,
            color: "#409EFF",
            line: {
              color: "white",
              width: 0.5,
            },
          },
          type: "scatter3d",
        },
      ],

      layoutKJdev: {
        title: "K,J,Dev Space",
        hoverlabel: {
          bgcolor: "#FFF",
        },
        scene: {
          xaxis: {
            title: "K",
            range: [1, 10],
          },
          yaxis: {
            title: "J",
            range: [0, 1],
          },
          zaxis: {
            title: "Dev",
          },
        },
        height: 800,
        width: 800,
      },
    }; //return
  }, //data

  methods: {
    tredplot: function () {
      if (this.value1) {
        this.loading = true;
        setTimeout(() => {
          this.value2 = true;
          this.loading = false;
        }, 500);
      } else {
        this.loading = true;
        setTimeout(() => {
          this.value2 = false;
          this.loading = false;
        }, 500);
      }
    },
  },

  created: function () {
    var i;
    var sommaK = [];
    var sommaDev = [];
    var sommaKT = [];

    for (i = 0; i < 10; i++) sommaK.push(0);
    for (i = 0; i < 10; i++) sommaKT.push(0);

    for (i = 0; i < 5; i++) sommaDev.push(0);

    for (i = 0; i < this.NUMSTUDENTI; i++) {
      //3dimensional
      this.dataKJDev[0].x.push(this.classe[i].k);
      this.dataKJDev[0].y.push(this.classe[i].j);
      this.dataKJDev[0].z.push(this.classe[i].dev);

      //scatter-chart
      this.dataKJ[0].x.push(this.classe[i].k);
      this.dataKJ[0].y.push(this.classe[i].j);

      // grafico di confronto Peer-Teacher
      this.dataPT[0].x.push(i);
      // this.dataPT[0].y.push(Math.abs(this.classe[i].kt - this.classe[i].k));
      this.dataPT[0].y.push(this.classe[i].delta);

      // --------------------------- K -----------------------------------------
      if (this.classe[i].k >= 0 && this.classe[i].k < 2) sommaK[0]++;
      else if (this.classe[i].k >= 2 && this.classe[i].k < 3) sommaK[1]++;
      else if (this.classe[i].k >= 3 && this.classe[i].k < 4) sommaK[2]++;
      else if (this.classe[i].k >= 4 && this.classe[i].k < 5) sommaK[3]++;
      else if (this.classe[i].k >= 5 && this.classe[i].k < 6) sommaK[4]++;
      else if (this.classe[i].k >= 6 && this.classe[i].k < 7) sommaK[5]++;
      else if (this.classe[i].k >= 7 && this.classe[i].k < 8) sommaK[6]++;
      else if (this.classe[i].k >= 8 && this.classe[i].k < 9) sommaK[7]++;
      else if (this.classe[i].k >= 9 && this.classe[i].k < 10) sommaK[8]++;
      else sommaK[9]++;

      // --------------------------- KT -----------------------------------------
      if (this.TeacherGrades[i] >= 0 && this.TeacherGrades[i] < 2) sommaKT[0]++;
      else if (this.TeacherGrades[i] >= 2 && this.TeacherGrades[i] < 3)
        sommaKT[1]++;
      else if (this.TeacherGrades[i] >= 3 && this.TeacherGrades[i] < 4)
        sommaKT[2]++;
      else if (this.TeacherGrades[i] >= 4 && this.TeacherGrades[i] < 5)
        sommaKT[3]++;
      else if (this.TeacherGrades[i] >= 5 && this.TeacherGrades[i] < 6)
        sommaKT[4]++;
      else if (this.TeacherGrades[i] >= 6 && this.TeacherGrades[i] < 7)
        sommaKT[5]++;
      else if (this.TeacherGrades[i] >= 7 && this.TeacherGrades[i] < 8)
        sommaKT[6]++;
      else if (this.TeacherGrades[i] >= 8 && this.TeacherGrades[i] < 9)
        sommaKT[7]++;
      else if (this.TeacherGrades[i] >= 9 && this.TeacherGrades[i] < 10)
        sommaKT[8]++;
      else sommaKT[9]++;

      // --------------------------- Dev -----------------------------------------
      if (this.classe[i].dev >= 0.0 && this.classe[i].dev < 1.0) {
        sommaDev[0]++;
      } else if (this.classe[i].dev >= 1.0 && this.classe[i].dev < 2.0) {
        sommaDev[1]++;
      } else if (this.classe[i].dev >= 2.0 && this.classe[i].dev < 3.0) {
        sommaDev[2]++;
      } else if (this.classe[i].dev >= 3.0 && this.classe[i].dev < 4.0) {
        sommaDev[3]++;
      } else {
        sommaDev[4]++;
      }
    }

    this.dataK[0].y = JSON.parse(JSON.stringify(sommaK));
    this.dataKT[0].y = JSON.parse(JSON.stringify(sommaKT));
    this.dataDev[0].values = JSON.parse(JSON.stringify(sommaDev));
    console.log(this.dataDev[0].values);
    this.dataDelta[0].value = this.deltaR;

    // limite asse y dinamico
    this.layoutK.yaxis.range[1] = this.NUMSTUDENTI;
    this.layoutKT.yaxis.range[1] = this.NUMSTUDENTI;

    // console.log(this.dataKT);
  },
};
</script>

<style type="text/css" scoped>
.small {
  width: 400px;
}

.big {
  width: 800px;
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

.box-card {
  min-height: 400px;
  margin: 30px;
}
</style>