<template>
  <div class="course" v-if="course.courseName">
    <div class="heading">
      <span>{{ `Khóa học: ${course.courseName}` }}</span>
    </div>
    <div class="container">
      <div class="description">
        <span class="title">Mô tả</span>
        <p v-html="course.courseDescription"></p>
      </div>
      <div class="tools">
        <span class="title">Công cụ</span>
        <ul class="list-tool">
          <li class="tool" v-for="tool in course.courseTools">
            <span class="sub-title">{{ tool.toolName }}</span>
            <ul class="des-tool">
              <li>{{ `Mô tả: ${tool.toolDescription}` }}</li>
              <li>{{ `Phiên bản: ${tool.toolVersion}` }}</li>
              <li>{{ `Phân loại: ${tool.toolTypes}` }}</li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="levels">
        <span class="title">Học phần</span>
        <ul class="list-level">
          <li class="level" v-for="level in course.courseLevels">{{ level }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Course",
  props: {
    course: {},
  },
};
</script>

<style scoped>
.course {
  max-width: 800px;
  min-width: 500px;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;

  .heading {
    margin-bottom: 40px;

    span {
      font-size: var(--text-heading);
      color: var(--primary-color);
      font-weight: var(--font-weight-heading);
    }
  }

  .container {

    .description,
    .tools,
    .levels {
      margin-bottom: 20px;

      .title,
      .sub-title {
        color: var(--secondary-color);
        font-weight: var(--font-weight-title);
        font-size: var(--text-title);
        padding-bottom: 10px;
        display: block;
      }

      .list-tool,
      .list-level {
        list-style: none;

        li{
          margin: 5px 0;
        }

        .sub-title {
          font-size: var(--text-subtitle);
          color: var(--primary-color);
        }
      }

    }
  }
}
</style>
