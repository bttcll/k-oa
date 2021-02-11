<template>
  <div>
    <el-main>
      <div>
        <h1 class="titolo">Teaching Analytics Platform</h1>
      </div>
      <br />
      <p></p>

      <el-steps :active="active" finish-status="success">
        <el-step title="Step 1" description="Build & Save  a new MOOC"></el-step>
        <el-step title="Step 2" description="Load an old MOOC"></el-step>
        <el-step title="Step 3" description="Teacher Grading"></el-step>
        <el-step title="Step 4" description="MOOC's Learning"></el-step>
      </el-steps>

      <el-divider></el-divider>

      <table align="center">
        <caption>
          <h1 class="titolo">The community</h1>
        </caption>
        <tr>
          <td>
            <el-card class="box-card" shadow="hover">
              <div class="text item">
                <h1># Learners</h1>
                <h2>{{ NUMSTUDENTI }}</h2>
              </div>
            </el-card>
          </td>

          <td>
            <el-card class="box-card" shadow="hover">
              <div class="text item">
                <h1># Peers' Assessments</h1>
                <h2>{{ NUMSTUDENTIVOTATI }}</h2>
              </div>
            </el-card>
          </td>
        </tr>
      </table>
    </el-main>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "home-component",

  computed: mapState([
    "NUMSTUDENTI",
    "NUMSTUDENTIVOTATI",
    "NumeroCore",
    "builded",
    "kDone",
  ]),

  data: function () {
    return {
      active: 0,
    };
  },

  created: function () {
    if (!this.NUMSTUDENTI) this.active = this.builded;
    else if (this.NUMSTUDENTI && this.NumeroCore > 2)
      this.active = 3 + this.kDone;
    else this.active = 2;
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.item {
  padding: 18px 0;
  text-align: center;
}

.box-card {
  min-width: 300px;
}

.titolo {
  color: #409eff;
  text-align: center;
}
</style>
