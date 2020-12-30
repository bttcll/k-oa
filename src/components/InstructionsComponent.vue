<template>
  <div>
    <el-main>
      <div style="height: 300px;">
  <el-steps direction="vertical" :active="4" >
    <el-step title="Step 1" description="MOOC building. In this step, a new MOOC, based on a PA is built;"></el-step>
    <el-step title="Step 2" description="Loading a MOOC. The previous MOOC, saved in a text file as an undirected graph is now loaded. Each SM is initialized and visualized into the screen;"></el-step>
    <el-step title="Step 3" description="Teacher grading Building of the teacher grades distribution with parameters entered by hand;"></el-step>
      <el-step title="Step 4" description="K-NN. This module is launched and all the SMs are modified changing their positions in the (K,J) space;"></el-step>

    
  </el-steps>
</div>
      
    </el-main>
  </div>
</template>

<script>
export default {
  name: "instructions-component",
  data: function () {
    return {};
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
