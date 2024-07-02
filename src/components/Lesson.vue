<template>
  <div class="lesson" v-if="lesson.lessonName">
    <div class="heading">
      <span>{{ `Bài ${lesson.lessonNumber} - ${lesson.lessonName}` }}</span>
    </div>
    <div class="container">
      <div class="description">
        <span class="title">{{ `Chủ đề bài học:  ${lesson.lessonTopic}` }}</span>
      </div>
      <div class="goal">
        <span class="title">Mục tiêu bài học</span>
        <p v-html="lesson.lessonGoal"></p>
      </div>
      <div class="tools">
        <span class="title">Công cụ</span>
        <ul class="list-tool">
          <li class="tool" v-for="tool in lesson.lessonTools" :key="tool">
            <span class="sub-title">{{ String(tool).toUpperCase() }}</span>
          </li>
        </ul>
      </div>
      <div class="concepts">
        <span class="title">Khái niệm bài học</span>
        <div v-for="(concepts, category) in lesson.lessonConcepts" :key="category">
          <p class="sub-title">{{ category == "conceptComputerScience"? 
          "Khoa học máy tính": category == "conceptScience"? 
          "Khoa học": category == "conceptTech"? 
          "Công nghệ": category == "conceptEngineering"? 
          "Kỹ thuật" :category == "conceptArt"? 
          "Nghệ thuật": category == "conceptMath"?
          "Toán": "Kỹ năng"  }}</p>
          <ul class="list-concept">
            <li v-html="concept" v-for="concept in concepts" :key="concept"></li>
          </ul>
        </div>
      </div>
      <div class="materials-type">
        <span class="title">Tài liệu</span>
        <div v-for="(material, materialTypeKey) in lesson.materials" :key="materialTypeKey">
          <p class="sub-title">{{ String(material.materialType).toUpperCase()}}</p>
          <ul class="list-material">
            <li>
              <b>{{ material.materialName }}:</b> <a :href="material.materialLink" target="_blank">{{ material.materialLink }}</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="project-details">
        <span class="title">Dự án</span>
        <p><b>Tên dự án:</b> {{ lesson.project.projectName}}</p>
        <p><b>Mô tả dự án:</b> {{ lesson.project.projectDescription }}</p>
        <div>
          <span class="sub-title">Khái niệm liên quan</span>
          <ul class="list-concept">
            <li v-for="(concept, index) in lesson.project.projectRelatedConcepts" :key="index">{{ concept }}</li>
          </ul>
        </div>
        <div>
          <span class="sub-title">Công cụ</span>
          <ul class="list-tool">
            <li v-for="(tool, index) in lesson.project.projectTools" :key="index">{{ tool.toolName }}</li>
          </ul>
        </div>
        <p><b>Giới thiệu dự án:</b> <a class="link" :href="lesson.project.projectInstruction" target="_blank">{{ lesson.project.projectInstruction }}</a></p>
      </div>
      <div class="tools-details">
        <span class="title">Mô tả chi tiết công cụ</span>
        <div v-for="(tool, index) in lesson.project.tools" :key="index">
          <ul class="list-tool">
            <li><i>Tool ID:</i> {{ tool.toolId }}</li>
            <li><i>Tool Name:</i> {{ tool.toolName }}</li>
            <li><i>Tool Description:</i> {{ tool.toolDescription }}</li>
            <li><i>Tool Version:</i> {{ tool.toolVersion }}</li>
            <li><i>Tool Types:</i> {{ tool.toolTypes }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Lesson',
  props: {
    lesson: Object
  }
}
</script>

<style scoped>
.lesson {
  margin: 20px 0;
  width: 100%;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
}

.heading {
  margin-bottom: 40px;
}

.heading span {
  font-size: var(--text-heading);
  color: var(--primary-color);
  font-weight: var(--font-weight-heading);
}

.container {
  .description,
  .goal,
  .tools,
  .concepts,
  .materials-type,
  .project-details,
  .tools-details {
    margin-bottom: 20px;

    .title,
    .sub-title {
      color: var(--secondary-color);
      font-weight: var(--font-weight-title);
      font-size: var(--text-title);
      padding-bottom: 10px;
      display: block;
    }
    .sub-title{
      padding-left: 20px;
      font-size: var(--text-subtitle);
      color: var(--primary-color);
    }

    .list-tool,
    .list-concept,
    .list-material {
      list-style: none;
      padding-left: 40px;
      
      li {
        margin: 5px 0;
      }
    }
  }
}

.topic,
.tools-list {
  color: var(--black-color);
  font-size: var(--text-normal);
  margin-bottom: 0px;
}

.link {
  color: var(--primary-color);
  font-weight: bold;
  font-size: var(--text-normal);
}
</style>
