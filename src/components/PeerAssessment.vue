<template>
  <div>
    <el-main v-loading="loading" element-loading-text="Loading...">
      <p>Peer assessment description.......</p>

      <el-alert
        title="To select the download folder and rename the mooc file, make sure you have activated the browser correct option "
        type="info"
        show-icon
        :closable="false"
      >
        "Ask where to save each file before downloading"
        <el-link
          type="primary"
          href="https://www.wikihow.com/Choose-Where-a-Download-is-Saved"
          target="_blank"
          >(check here)</el-link
        >
      </el-alert>

      <br />

      <template>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="label" label="Label" width="300">
          </el-table-column>
          <el-table-column prop="value" label="Value"> </el-table-column>
        </el-table>
      </template>

      <br />

      <el-form label-position="left" label-width="250px">
        <el-form-item label="Peer assessments number: ">
          <el-input-number
            v-model="gradesNumber"
            :min="1"
            :max="studentsNumber - 1"
            :disabled="sceltoGauss"
          />
        </el-form-item>

        <el-form-item label="Peer assessments mode: ">
          <div>
            <el-radio v-model="pamode" label="circular" border
              >Circular <i class="el-icon-refresh"
            /></el-radio>
            <el-radio v-model="pamode" label="random" border
              >Random <i class="el-icon-connection"
            /></el-radio>
            <!-- <el-button @click="test"> test </el-button> -->
          </div>
        </el-form-item>

        <br />

        <el-form-item>
          <el-button type="primary" @click="multisessione">Build</el-button>
          <el-button @click="gradesNumber = 1">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </div>
</template>

<script type="text/javascript">
import { mapState, mapMutations } from "vuex";

export default {
  name: "peer-assessment",

  computed: mapState([
    "NUMSTUDENTI",
    "NUMSTUDENTIVOTATI",
    "alfakT",
    "KMIN",
    "KMAX",
    "nSessione",
  ]),

  data: function () {
    return {
      pamode: "circular",
      sceltoGauss: false,
      dialogVisible: false,
      activeName: "1",
      loading: false,
      studentsNumber: 0,
      gradesNumber: 0,
      alfa: 0.1,
      media: 5.5,
      varianza: 2,
      kValue: [1, 10],
      marks: {
        1: "1",
        5: "5",
        10: "10",
      },
      file: null,

      tableData: [
        {
          label: "Students number",
          value: 0,
        },
        // {
        //   label: "Peer assessments number",
        //   value: 0,
        // },
        {
          label: "Alpha",
          value: 0,
        },
        {
          label: "Rating scale",
          value: "",
        },
      ],
    };
  },

  created: function () {
    this.tableData[0].value = this.NUMSTUDENTI;
    this.tableData[1].value = this.alfakT;
    this.tableData[2].value = this.KMIN + " - " + this.KMAX;
    this.studentsNumber = this.NUMSTUDENTI;
  },

  methods: {
    //RICHIAMO FUNZIONI DALLO STATO
    ...mapMutations(["resetAll", "GeneraMatriceAdiacenzaMultisessione"]),

    multisessione: function () {
      console.log("start multisessione");
      this.loading = true;

      //MESSAGGIO DI BUILD
      this.$message("Building...");

      // FUNZIONE E FINE LOADING
      setTimeout(() => {
        const fromComponent = {
          // functionN: 1,
          pamode: this.pamode,
          Voti: this.gradesNumber,
        };
        this.GeneraMatriceAdiacenzaMultisessione(fromComponent);
        this.loading = false;
        this.$message({
          message: "Congrats, MOOC created.",
          type: "success",
        });
      }, 1000);
    },
  },
};
</script>

<style type="text/css" scoped>
</style>