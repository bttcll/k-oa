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

      <el-button type="primary" @click="multisessione">Primary</el-button>
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
        {
          label: "Peer assessments number",
          value: 0,
        },
        {
          label: "Alpha",
          value: 0,
        },
        {
          label: "Rating scale",
          value: "",
        },
        {
          label: "Peer assessments mode",
          value: "Circular",
        },
      ],
    };
  },

  created: function () {
    this.tableData[0].value = this.NUMSTUDENTI;
    this.tableData[1].value = this.NUMSTUDENTIVOTATI;
    this.tableData[2].value = this.alfakT;
    this.tableData[3].value = this.KMIN + " - " + this.KMAX;
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
        this.GeneraMatriceAdiacenzaMultisessione();
        this.loading = false;
        this.$message({
          message: "Congrats, MOOC created.",
          type: "success",
        });
      }, 1000);
    },

    test: function () {
      console.log(this.pamode);

      const MAXASS = 50;
      let numeri = [nStudenti];
      let n;
      let nAssessments = this.gradesNumber;
      let nStudenti = this.studentsNumber;

      try {
        while (nAssessments > nStudenti || nAssessments > MAXASS) {
          console.error("Numero di Assessments troppo elevato!\n");
        }

        let matrice = [];
        // let matrice = [nStudenti][nAssessments];
        for (let i = 0; i < nStudenti; i++) {
          matrice[i] = [];
          for (let j = 0; j < nAssessments; j++) {
            matrice[i][j] = 0;
          }
        }
        // riempi con i numeri interi delle posizioni nella matrice di adiacenza
        for (let i = 0; i < nStudenti; i++) {
          numeri[i] = i;
        }

        // NB max studenti 32000
        // srand(time(NULL));

        for (let j = 0; j < nAssessments; j++) {
          for (let i = 0; i < nStudenti; i++) {
            do {
              n = Math.floor(Math.random() * nStudenti);
              //printf("n=%d\n",n);
              //printf("numeri[%d]=%d n=%d\n",i,numeri[i],n);

              //system("pause");
            } while (i == n || numeri[n] == -1);
            matrice[i][j] = n;
            //printf("passo\n");
            numeri[n] = -1;
          }

          for (let i = 0; i < nStudenti; i++) {
            //printf("%d\n",numeri[i]);
            numeri[i] = i;
          }
        }
        // scrivi su file
        //  printf("Nome del file:\n");
        //  scanf("%s",nomeFile);
        //  fp=fopen(nomeFile,"w+");
        for (let y = 0; y < nStudenti; y++) {
          for (let i = 0; i < nAssessments; i++) {
            console.log(matrice[y][i]);
            // fprintf(fp,"%d,",matrice[y][i]);
          }
          console.log("\n");
          // fprintf(fp,"\n");
        }
      } catch (error) {
        console.error(error);
      }
    },

    loadTextFromFile(ev) {
      const file = ev.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        this.file = e.target.result;
      };
      reader.readAsText(file);
    },

    real: function () {
      const fromComponent = {
        // functionN: 1,
        pamode: this.pamode,
        NumSt: this.studentsNumber,
        Voti: this.gradesNumber,
        alfa: this.alfa,
        min: this.kValue[0],
        max: this.kValue[1],
        file: this.file,
      };
      //resetto tutto prima di creare il file
      this.resetAll();
      this.loading = true;

      //MESSAGGIO DI BUILD
      this.$message("Building...");

      // FUNZIONE E FINE LOADING
      setTimeout(() => {
        this.GeneraMatriceAdiacenza(fromComponent);
        this.loading = false;
        this.$message({
          message: "Congrats, MOOC created.",
          type: "success",
        });
      }, 1000);
    },

    // FUNZIONE GAUSS ATTIVABILE CON LE FUNZIONI SOPRA LA TABELLA
    gauss: function () {
      this.dialogVisible = false;
      const fromComponent = {
        // functionN: 6,
        NumSt: this.studentsNumber,
        media: this.media,
        varianza: this.varianza,
        min: this.kValue[0],
        max: this.kValue[1],
      };
      this.loading = true;
      setTimeout(() => {
        this.Gauss(fromComponent);
        this.loading = false;
      }, 500);
    },
  },
};
</script>

<style type="text/css" scoped>
</style>