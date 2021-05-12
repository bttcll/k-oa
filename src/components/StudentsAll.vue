<template>
  <div>
    <el-main v-loading="loading" element-loading-text="Loading...">
      <p>
        Teacher Grading: By this option the user(tutor or teacher) can grade
        one, all or a group of students. When a MOOC is loaded, all the students
        are presented to the user and can be sorted according to their Dev
        value. First this allows to select the students directly to grade,
        basing this choice on the reliability of their current K value as
        computed by peers. Secondly, the user can give a grade from 1 to 10.
      </p>

      <p>
        Assign Real Grades: Thanks to this function, the user can assign values
        directly to one or more students. The features of this function have to
        be described in depth as used in our RQ study. Once the user launches
        this function, the number of students to be assigned the real grade is
        requested. The real grade is the true grade that the teacher would have
        given to the student or to a group of them, as explained in the previous
        Section. So this function does nothing but copy the real votes on the
        students’ current grades.
      </p>

      <ul>
        <li>kP = K Peer</li>
        <li>kR = K Real</li>
        <li>kT = K Teacher</li>
      </ul>

      <el-collapse v-model="activeName" accordion>
        <el-collapse-item name="1">
          <template slot="title">
            <i class="header-icon el-icon-info"></i>
            &nbsp;STATfunction: insert&nbsp;
            <b>delta</b>&nbsp;shift between teacher-student
          </template>

          <el-form label-position="left" :inline="true">
            <el-form-item label="Delta: ">
              <el-input-number
                v-model="delta"
                :precision="2"
                :step="0.1"
                :min="0"
                :max="1"
              ></el-input-number>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="inizialize(), (loading = true)"
                >Inizialize</el-button
              >
            </el-form-item>
          </el-form>
        </el-collapse-item>

        <el-collapse-item name="2">
          <template slot="title">
            <i class="header-icon el-icon-info"></i>
            &nbsp;STATfunction: assign real grade
          </template>

          <el-form label-position="left" :inline="true">
            <el-form-item label="Students to grade: ">
              <el-input-number
                v-model="nReal"
                :min="1"
                :max="NUMSTUDENTI"
              ></el-input-number>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="realGrade(), (loading = true)"
                >Start</el-button
              >
            </el-form-item>
          </el-form>
        </el-collapse-item>

        <el-collapse-item name="3">
          <template slot="title">
            <i class="el-icon-timer"></i>
            &nbsp; Quick Teacher grading
          </template>

          <el-form label-position="left" :inline="true">
            <el-form-item label="Students to grade: ">
              <el-input-number
                v-model="nReal"
                :min="1"
                :max="NUMSTUDENTI"
              ></el-input-number>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="sendGradeFast(), (loading = true)"
                >Start</el-button
              >
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>

      <!-- <el-table	   
	ref="classTable"
	:data="classe"
	:default-sort = "{prop: 'dev', order: 'ascending'}"
	size="small"	 
	:row-style="tableRowStyle"
      max-height="350">-->

      <el-alert
        v-if="componentKey &gt; 2"
        title="you have voted some students, you can use the k-nn algorithm if you want "
        type="info"
        show-icon
      ></el-alert>
      <br />

      <table>
        <td>
          <el-radio-group v-model="filters[0].value" size="mini">
            <el-radio-button label>All</el-radio-button>
            <el-radio-button label="1">Core</el-radio-button>
            <el-radio-button label="0">NoCore</el-radio-button>
          </el-radio-group>
        </td>
        <td>
          <el-tag size="medium">α = {{ alfakT }}</el-tag>
        </td>
        <td>
          <el-tag size="medium">kMIN = {{ KMIN }}</el-tag>
        </td>
        <td>
          <el-tag size="medium">kMAX = {{ KMAX }}</el-tag>
        </td>
      </table>

      <data-tables
        :key="componentKey"
        :data="classe"
        :table-props="tableProps"
        :filters="filters"
        :page-size="10"
        :pagination-props="{
          small: true,
          background: true,
          pageSizes: [10, 50, 100],
        }"
      >
        <el-table-column
          prop="index"
          label="ID"
          width="100"
          sortable="custom"
        ></el-table-column>

        <el-table-column
          prop="k"
          label="kP"
          width="100"
          :formatter="kContent"
          sortable="custom"
        ></el-table-column>

        <el-table-column
          prop="j"
          label="J"
          width="100"
          :formatter="kContent"
          sortable="custom"
        ></el-table-column>

        <el-table-column
          :key="classe.dev"
          prop="dev"
          label="DEV"
          width="100"
          sortable="custom"
          :formatter="jdevContent"
        ></el-table-column>

        <el-table-column prop="stato" label="S" width="100"></el-table-column>

        <el-table-column
          prop="kt"
          label="kR"
          width="100"
          :formatter="kContent"
        ></el-table-column>

        <!-- <el-table-column prop="jt" label="jt" width="100" :formatter="jdevContent"></el-table-column> -->

        <el-table-column
          prop="kTeacher"
          label="kT"
          :formatter="kContent"
          width="100"
        ></el-table-column>

        <el-table-column
          prop="delta"
          label="Delta"
          width="100"
          :formatter="kContent"
          sortable="custom"
        ></el-table-column>

        <el-table-column
          align="center"
          fixed="right"
          label="Teacher grading"
          width="130"
        >
          <template slot-scope="scope">
            <el-link
              icon="el-icon-edit-outline"
              class="icon"
              v-if="!scope.row.stato"
              :underline="false"
              @click.native.prevent="grade(scope.row), (form.num = 1)"
            ></el-link>
          </template>
        </el-table-column>
      </data-tables>

      <!-- </el-table> -->
    </el-main>

    <el-dialog title="Teacher grading" :visible.sync="dialogVoteVisible">
      <p>Which grade would you like to assign to the selected student?</p>

      <el-table :data="selectData">
        <el-table-column property="index" label="ID"></el-table-column>
        <el-table-column property="k" label="K"></el-table-column>
        <el-table-column property="j" label="J"></el-table-column>
        <el-table-column property="dev" label="DEV"></el-table-column>
      </el-table>

      <br />

      <!-- <el-form :model="form"> 
   <el-form-item label="Grade:" >
   <el-input-number v-model="form.num" :min="1" :max="10"></el-input-number>
   </el-form-item>
      </el-form>-->

      <div class="block">
        <i class="el-icon-caret-right" />
        <span>
          <b>Grade: {{ form.num }}</b>
        </span>
        <el-slider
          v-model="form.num"
          :min="KMIN"
          :max="KMAX"
          show-stops
        ></el-slider>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVoteVisible = false">Cancel</el-button>
        <el-button type="primary" @click="sendGrade(), (loading = true)"
          >Confirm</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { DataTables } from "vue-data-tables";

export default {
  name: "students-all",

  components: {
    DataTables,
  },

  // VARIABILI DALLO STATO
  computed: mapState([
    "classe",
    "NumeroCore",
    "NUMSTUDENTI",
    "alfakT",
    "KMIN",
    "KMAX",
  ]),

  data: function () {
    return {
      activeName: "3",
      loading: false,
      componentKey: 0,
      delta: 0,
      nReal: 1,

      filters: [
        {
          prop: "stato",
          value: "",
        },
      ],

      tableProps: {
        maxHeight: "350",
        size: "small",
        rowStyle: this.tableRowStyle,
      },

      dialogVoteVisible: false,

      form: {
        num: 1,
      },

      selectData: [
        {
          index: 0,
          k: 0,
          j: 0,
          dev: 0,
        },
      ],
    };
  },

  methods: {
    //FUNZIONI DALO STATO
    ...mapMutations([
      "Teacher",
      "InitializeStudentModelByTeacher",
      "AssignRealGrade",
    ]),

    // kContent: function(row, column, cellValue, index){
    kContent: function (row, column, cellValue) {
      return Number.parseFloat(cellValue).toPrecision(2);
    },

    // jdevContent: function(row, column, cellValue, index){
    jdevContent: function (row, column, cellValue) {
      return Number.parseFloat(cellValue).toPrecision(4);
    },

    // tableRowStyle({row, rowIndex}) {
    tableRowStyle({ row }) {
      if (row.stato == 1) {
        return { background: "#f0f9eb" };
      } else {
        return {};
      }
    },

    grade: function (row) {
      this.selectData[0].index = row.index;
      this.selectData[0].k = Number.parseFloat(row.k).toPrecision(2);
      this.selectData[0].j = Number.parseFloat(row.j).toPrecision(4);
      this.selectData[0].dev = Number.parseFloat(row.dev).toPrecision(4);

      this.dialogVoteVisible = true;
      return;
    },

    sendGrade: function () {
      this.dialogVoteVisible = false;

      const fromComponent = {
        // functionN: 3,
        studente: this.selectData[0].index,
        voto: this.form.num,
      };

      this.form.num = 1;
      setTimeout(() => {
        // this.$emit('componentEvent', fromComponent);
        // FUNZIONE DALLO STATO
        this.Teacher(fromComponent);
        this.loading = false;
      }, 500);
      this.componentKey += 1;
    },

    sendGradeFast: function () {
      setTimeout(() => {
        for (let i = 0; i < this.nReal; i++) {
          let fromComponent = {
            // functionN: 3,
            studente: i,
            voto: this.classe[i].kt,
          };
          this.Teacher(fromComponent);
        }
        // this.$emit('componentEvent', fromComponent);
        // FUNZIONE DALLO STATO
        this.loading = false;
      }, 500);
      this.componentKey += this.nReal;
    },

    inizialize: function () {
      const fromComponent = {
        // functionN: 5,
        delta: this.delta,
      };

      setTimeout(() => {
        // this.$emit('componentEvent', fromComponent);
        this.InitializeStudentModelByTeacher(fromComponent);
        this.loading = false;
      }, 500);
      this.componentKey += 1;
    },

    realGrade: function () {
      const fromComponent = {
        // functionN: 7,
        n: this.nReal,
      };

      setTimeout(() => {
        // this.$emit('componentEvent', fromComponent);
        this.AssignRealGrade(fromComponent);
        this.loading = false;
      }, 500);
      this.componentKey += 1;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style type="text/css" scoped>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}

.icon {
  font-size: 18px;
}
</style>
