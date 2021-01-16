<template>
  <div>
    <el-main>
      <p>
        K-NN. This module is launched and all the SMs are modified changing
        their positions in the (K,J) space;
      </p>

      <el-card class="box-card" shadow="never">
        Start k-nearest neighbors algorithm
        <el-button
          type="success"
          icon="el-icon-check"
          circle
          @click="startKnn"
          v-if="!componentKey"
        ></el-button>
      </el-card>

      <br />

      <Plotly :data="dataKJ" :layout="layoutKJ" :display-mode-bar="false" />
      <Plotly :data="dataPT" :layout="layoutPT" :display-mode-bar="false" />
      <div align="center">
        <Plotly
          :data="dataKJDev"
          :layout="layoutKJdev"
          :display-mode-bar="false"
        />
      </div>
    </el-main>
  </div>
</template>

<script type="text/javascript">
import { mapState, mapMutations } from "vuex";
import { Plotly } from "vue-plotly";

export default {
  name: "knn-component",

  components: {
    Plotly,
  },

  computed: mapState(["classe", "NUMSTUDENTI"]),

  data: function () {
    return {
      componentKey: 0,

      dataKJ: [
        {
          x: [],
          y: [],
          name: "initial position",
          mode: "markers",
          type: "scatter",
          marker: { color: "#409EFF" },
        },
        {
          x: [],
          y: [],
          name: "updated",
          mode: "markers",
          type: "scatter",
          marker: { color: "red" },
        },
      ],

      layoutKJ: {
        title: "Scatter chart of the space K,J distribuition",
        xaxis: { title: "K", range: [1, 10.1] },
        yaxis: { title: "J", range: [0, 1] },
      },

      dataPT: [
        {
          x: [],
          y: [],
          name: "Initial distance ",
          type: "scatter",
          mode: "markers",
          marker: { color: "#409EFF" },
        },
        {
          x: [],
          y: [],
          name: "Updated",
          type: "scatter",
          mode: "markers",
          marker: { color: "red" },
        },
      ],

      layoutPT: {
        title: "Peers vs Teacher",
        hoverlabel: {
          bgcolor: "#FFF",
        },
        xaxis: {
          title: "Student",
        },
        yaxis: {
          title: "Distance",
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
        {
          x: [],
          y: [],
          z: [],
          name: "",
          hovertemplate: "K: %{x}" + "<br />J: %{y}" + "<br />Dev: %{z}",
          mode: "markers",
          marker: {
            size: 5,
            color: "red",
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
    };
  },

  methods: {
    ...mapMutations(["Knn"]),
    startKnn: function () {
      this.componentKey += 1;

      setTimeout(() => {
        // this.$emit('componentEvent', fromComponent);
        this.Knn();
        for (let i = 0; i < this.NUMSTUDENTI; i++) {
          //scatter-chart
          this.dataKJ[1].x.push(this.classe[i].k);
          this.dataKJ[1].y.push(this.classe[i].j);

          this.dataPT[1].x.push(i);
          // this.dataPT[0].y.push(Math.abs(this.classe[i].kt - this.classe[i].k));
          this.dataPT[1].y.push(this.classe[i].delta);

          //3dimensional
          this.dataKJDev[1].x.push(this.classe[i].k);
          this.dataKJDev[1].y.push(this.classe[i].j);
          this.dataKJDev[1].z.push(this.classe[i].dev);
        }
      }, 500);
    },
  },

  created: function () {
    var i;

    for (i = 0; i < this.NUMSTUDENTI; i++) {
      //scatter-chart
      this.dataKJ[0].x.push(this.classe[i].k);
      this.dataKJ[0].y.push(this.classe[i].j);

      // grafico di confronto Peer-Teacher
      this.dataPT[0].x.push(i);
      // this.dataPT[0].y.push(Math.abs(this.classe[i].kt - this.classe[i].k));
      this.dataPT[0].y.push(this.classe[i].delta);

      //3dimensional
      this.dataKJDev[0].x.push(this.classe[i].k);
      this.dataKJDev[0].y.push(this.classe[i].j);
      this.dataKJDev[0].z.push(this.classe[i].dev);
    }
  },
};
</script>

<style type="text/css" scoped>
.box-card {
  width: 400px;
  text-align: center;
}

.small {
  width: 400px;
}
</style>