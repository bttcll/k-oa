<template>
  <div>
    <el-main v-loading="loading" element-loading-text="Loading...">
      <p>
        Here a new community can be built. The user is requested to input the
        number of students and the number of peer assessments for each of them.
        Here a MOOC is represented by a direct and weighed graph where each node
        represents a student and each edge’s weight is the grade assigned by the
        student to her peers. The user can choose to let the system to
        completely simulate a peer evaluation: in this case a Gaussian grades
        distribution among peers is used.
      </p>

      <p>
        The “Generate Gauss grades” function generates a Gauss distribution of
        grades. First the user has to set the number of learners and secondly
        the mean µ and the variance σ of the normal distribution associated to
        the community.
      </p>
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
              />
            </el-form-item>

            <br />

            <el-form-item>
              <el-button type="primary" @click="real">Build</el-button>
              <el-button
                @click="
                  (studentsNumber = 10),
                    (gradesNumber = 1),
                    (kValue = [1, 10]),
                    (alfa = 0.1)
                "
                >Reset</el-button
              >
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </el-main>
  </div>
</template>

<script type="text/javascript">
import { mapMutations } from "vuex";

export default {
  name: "build-mooc-empty",

  data: function () {
    return {
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
    ...mapMutations(["resetAll", "GeneraMatriceAdiacenzaEmpty"]),

    real: function () {
      const fromComponent = {
        // functionN: 1,
        NumSt: this.studentsNumber,
        min: this.kValue[0],
        max: this.kValue[1],
      };
      //resetto tutto prima di creare il file
      this.resetAll();
      this.loading = true;

      //MESSAGGIO DI BUILD
      this.$message("Building...");

      // FUNZIONE E FINE LOADING
      setTimeout(() => {
        this.GeneraMatriceAdiacenzaEmpty(fromComponent);
        this.loading = false;
        this.$message({
          message: "Congrats, MOOC created.",
          type: "success",
        });
      }, 1000);
    }
  }
};
</script>

<style type="text/css" scoped>
</style>