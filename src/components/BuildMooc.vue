<template>
  <div>
    <el-main v-loading="loading" element-loading-text="Loading...">
      <p>
        Here a new MOOC can be build.
        After having selected this choice, the user is requested to input
        the number of students and the number of peer assessments
        for student. The MOOC is built and represented by a direct
        and weighed graph where each node is a student and each arc
        represents the grade assigned by the student to the peers.
        The user can leave the system the possibility to completely
        simulate a peer evaluation: in this case a Gaussian grades
        distribution among peers is used. As a result, we obtain a MOOC
        where each student has received n peer grades.
      </p>

      <p>
        Generate Gauss grades: this function generates a Gauss
        distribution of grades. First the user has to set the number
        of learners and secondly the mean µ and the variance σ
        of the normal distribution.
      </p>
      <el-alert
        title="To select the download folder and rename the mooc file, make sure you have activated the correct option of your browser"
        type="info"
        show-icon
        :closable="false"
      >
        "Ask where to save each file before downloading"
        <el-link
          type="primary"
          href="https://www.wikihow.com/Choose-Where-a-Download-is-Saved"
          target="_blank"
        >(check here)</el-link>
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
              <i class="el-icon-star-off" /> Generate Realgrade Distribution (new)
            </h4>
          </template>

          <el-form label-position="left" label-width="250px">
            <el-form-item label="Students number: ">
              <el-input-number v-model="studentsNumber" :step="10" :min="10" :max="10000" :disabled=sceltoGauss />
            </el-form-item>

            <el-form-item label="Peer assessments: ">
              <el-input-number v-model="gradesNumber" :min="1" :max="50" :disabled=sceltoGauss />
            </el-form-item>

            <el-form-item label="Alfa: ">
              <el-input-number v-model="alfa" :precision="2" :step="0.1" :disabled=sceltoGauss />
            </el-form-item>

            <el-form-item label="Rating scale: " >
              <el-slider v-model="kValue" range show-stops :min="1" :max="10" :marks="marks" style="width: 80%;" :disabled=sceltoGauss />
            </el-form-item>

            <el-form-item label="Import grades (optional): ">
              <el-button type="primary" size="medium" @click="dialogVisible = true, sceltoGauss=true" plain>Generate Gauss Grade</el-button>
              <br>
              <input type="file" @change="loadTextFromFile" accept=".txt" />
            </el-form-item>

            <br />

            <el-form-item>
              <el-button type="primary" @click="real">Build</el-button>
              <el-button @click="studentsNumber=10, gradesNumber=1, kValue=[1, 10], alfa=0.1, sceltoGauss=false">Reset</el-button>
            </el-form-item>
          </el-form>
        </el-collapse-item>

        <el-dialog  title="Generate Gauss Grade"  :visible.sync="dialogVisible"  width="30%" >
          <template slot="title">
            <h4>
              <i class="el-icon-data-analysis" /> Generate Gauss Grade
            </h4>
          </template>

          <el-form label-position="left" label-width="150px">
            <el-form-item label="Seed: ">
              <el-input-number v-model="seme" :step="1000" />
            </el-form-item>
            <el-form-item label="Average: ">
              <el-input-number v-model="media" :precision="2" :step="0.5" :min="1" :max="10" />
            </el-form-item>
            <el-form-item label="Variance: ">
              <el-input-number v-model="varianza" :precision="2" :step="0.5" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="gauss">Build</el-button>
              <el-button @click="media=5.5, sigma=1, sceltoGauss=false">Reset</el-button>
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
  name: "build-mooc",

  data: function() {
    return {
      sceltoGauss: false,
      dialogVisible: false,
      activeName: "1",
      loading: false,
      studentsNumber: 0,
      gradesNumber: 0,
      alfa: 0.1,
      media: 5.5,
      seme: -1000,
      varianza: 2,
      kValue: [1, 10],
      marks: {
        1: '1',
        5: '5',
        10: '10'
      },
      file: null
    };
  },

  methods: {
    //RICHIAMO FUNZIONI DALLO STATO
    ...mapMutations(["resetAll", "GeneraMatriceAdiacenza", "Gauss"]),

    loadTextFromFile(ev) {
      const file = ev.target.files[0];
      const reader = new FileReader();

      reader.onload = e => {
        this.file = e.target.result;
      };
      reader.readAsText(file);
    },

    real: function() {
      const fromComponent = {
        // functionN: 1,
        NumSt: this.studentsNumber,
        Voti: this.gradesNumber,
        alfa: this.alfa,
        min: this.kValue[0],
        max: this.kValue[1],
        file: this.file
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
          type: "success"
        });
      }, 1000);
    },

    // FUNZIONE GAUSS ATTIVABILE CON LE FUNZIONI SOPRA LA TABELLA
    gauss: function() {
      this.dialogVisible = false;
      const fromComponent = {
        // functionN: 6,
        NumSt: this.studentsNumber,
        media: this.media,
        seme: this.seme,
        varianza: this.varianza,
        min: this.kValue[0],
        max: this.kValue[1],
      };
      this.loading = true;
      setTimeout(() => {
        this.Gauss(fromComponent);
        this.loading = false;
      }, 500);
    }
  }
};
</script>

<style type="text/css" scoped>
</style>