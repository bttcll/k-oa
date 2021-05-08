<template>
  <div>
    <el-main v-loading="loading" element-loading-text="Loading...">
      <p>Teacher assessment description.....................</p>
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

      <el-alert
        v-if="studentsNumber &gt;= 1000 && studentsNumber &lt;= 5000"
        title="Big students number can slow the system!"
        type="warning"
        :closable="false"
      ></el-alert>

      <el-alert
        v-if="studentsNumber &gt; 5000"
        title="The system will probably crash."
        type="error"
        :closable="false"
      ></el-alert>

      <el-collapse v-model="activeName" accordion>
        <el-collapse-item name="1">
          <template slot="title">
            <h4>
              <i class="el-icon-star-off" /> Generate a new learning community
            </h4>
          </template>

          <el-form label-position="left" label-width="250px">
            <el-form-item label="Students number: ">
              <el-input-number
                v-model="studentsNumber"
                :step="10"
                :min="10"
                :max="10000"
                :disabled="sceltoGauss"
              />
            </el-form-item>

            <el-form-item label="Peer assessments number: ">
              <el-input-number
                v-model="gradesNumber"
                :min="1"
                :max="50"
                :disabled="sceltoGauss"
              />
            </el-form-item>

            <el-form-item label="Rating scale: ">
              <el-slider
                v-model="kValue"
                range
                show-stops
                :min="1"
                :max="10"
                :marks="marks"
                style="width: 80%"
                :disabled="sceltoGauss"
              />
            </el-form-item>

            <el-form-item label="Import grades (optional): ">
              <el-button
                type="primary"
                size="medium"
                @click="(dialogVisible = true), (sceltoGauss = true)"
                plain
                >Generate Gauss grades</el-button
              >
              <br />
              <input type="file" @change="loadTextFromFile" accept=".txt" />
            </el-form-item>

            <br />

            <el-form-item>
              <el-button type="primary" @click="real">Build</el-button>
              <el-button
                @click="
                  (studentsNumber = 10),
                    (gradesNumber = 1),
                    (kValue = [1, 10]),
                    (alfa = 0.1),
                    (sceltoGauss = false)
                "
                >Reset</el-button
              >
            </el-form-item>
          </el-form>
        </el-collapse-item>

        <el-dialog
          title="Generate Gaussian grades"
          :visible.sync="dialogVisible"
          width="30%"
        >
          <template slot="title">
            <h4>
              <i class="el-icon-data-analysis" />
              <center>Gaussian parameters</center>
            </h4>
          </template>

          <el-form label-position="left" label-width="150px">
            <el-form-item label="Mean: ">
              <el-input-number
                v-model="media"
                :precision="2"
                :step="0.1"
                :min="1"
                :max="10"
              />
            </el-form-item>
            <el-form-item label="Variance: ">
              <el-input-number v-model="varianza" :precision="2" :step="0.1" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="gauss">Build</el-button>
              <el-button
                @click="(media = 5.5), (sigma = 1), (sceltoGauss = false)"
                >Reset</el-button
              >
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-collapse>
    </el-main>
  </div>
</template>

<script type="text/javascript">
import { mapMutations } from "vuex";

export default {
  name: "teacher-assessment",

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
    };
  },

  methods: {
    //RICHIAMO FUNZIONI DALLO STATO
    ...mapMutations(["resetAll", "GeneraMatriceAdiacenzaDocenti", "Gauss"]),

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
        this.GeneraMatriceAdiacenzaDocenti(fromComponent);
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