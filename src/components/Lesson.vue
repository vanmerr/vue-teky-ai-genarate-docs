<template>
  <div>
    <!-- Content for Lesson -->
    <h4 class="lessonName">Bài {{lessonNumber}}: {{lessonName}}</h4>
    <p class="body">Chủ đề bài học:<span class="phara">{{ lessonTopic }}</span></p>
    <p class="body">Mục tiêu bài học:</p>
    <p v-html="lessonGoal"></p>
    <p class="body">Công cụ:<span class="phara">{{lessonTools}}</span></p>
    <p class="body">Lesson Concepts</p>
    <div v-for="(concepts, category) in lessonConcepts" :key="category">
      <p class="concept">{{ category }}</p>
      <ul>
        <li v-for="concept in concepts" :key="concept">{{ concept }}</li>
      </ul>
    </div>
    <p class="body">Lesson Materials</p>
    <ul>
      <li v-for="(value, key) in lessonMaterials" :key="key">
        {{ key }}: {{ value }}
      </li>
    </ul>
    <p class="body">Dự án bài học:<span class="phara">{{ lessonProject.projectId }}</span></p>
    <p class="body">Materials:</p>
    <div v-for="(materialType, materialTypeKey) in materials" :key="materialTypeKey">
      <p class="concept">{{ materialTypeKey }}</p>
      <ul>
        <li v-for="(material, key) in materialType" :key="key">
          {{ key }}: {{ material }}
        </li>
      </ul>
    </div>
      <p class="body">Dự án:</p>
      <p><b>Project ID:</b> {{ project.projectId }}</p>
      <p><b>Project Name:</b> {{ project.projectName }}</p>
      <p><b>Project Description:</b> {{ project.projectDescription }}</p>
      <p><b>Related Concepts</b></p>
      <ul>
        <li v-for="(concept, index) in project.projectRelatedConcepts" :key="index">{{ concept }}</li>
      </ul>
      <p><b>Project Tools</b></p>
      <ul>
        <li v-for="(tool, index) in project.projectTools" :key="index">{{ tool }}</li>
      </ul>
      <p><b>Project Instruction:</b><a class="link" :href="project.projectInstruction">{{ project.projectInstruction }}</a></p>
      <p><b>Tool Details</b></p>
      <div v-for="(tool, index) in project.tools" :key="index">
      <ul>
        <li><i>Tool ID:</i> {{ tool.toolId }}</li>
        <li><i>Tool Name:</i> {{ tool.toolName }}</li>
        <li><i>Tool Description:</i> {{ tool.toolDescription }}</li>
        <li><i>Tool Version:</i> {{ tool.toolVersion }}</li>
        <li><i>Tool Types:</i> {{ tool.toolTypes }}</li>
      </ul>
    </div>
    <p class="body">Công cụ</p>
    <ul>
      <div v-for="(tool, index) in tools" :key="index">
        <li>Tool ID: {{ tool.toolId }}</li>
        <li>Tool Name: {{ tool.toolName }}</li>
        <li>Tool Description: {{ tool.toolDescription }}</li>
        <li>Tool Version: {{ tool.toolVersion }}</li>
        <li>Tool Types: {{ tool.toolTypes }}</li>
      </div>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Lesson',
  // Add component logic if needed
  data(){
    return{
    "lessonId": "blg-hp01-b01",
    "courseId": "blg",
    "levelId": "blg-hp01",
    "lessonName": "Giới thiệu bản thân",
    "lessonNumber": 1,
    "lessonImage": "https://drive.google.com/file/d/1JvkZ6Ztgqsp4H6EldONsmuzKB6qwxJnA/view?usp=sharing",
    "lessonTopic": "Chào người bạn mới CodeKitten",
    "lessonGoal": "Kiến thức, khái niệm: <br>- Khái niệm lập trình và công cụ lập trình kéo thả CodeKitten.<br>- Các thành phần thuộc giao diện CodeKitten.<br>- Kỹ thuật gắn/gỡ khối lệnh trong lập trình dạng kéo thả. <br>- Kỹ thuật thêm/hiệu chỉnh nhân vật, hình nền trong CodeKitten.<br>- Kỹ thuật thêm phần mở rộng (extension) vào project.<br>- Khái niệm tuần tự trong cuộc sống và lập trình.<br>- Khối lệnh when flag click, when this sprite clicked (nhóm lệnh Event).<br>- Khối lệnh say..., say...for...secs (nhóm lệnh Look).<br>- Khối lệnh translate...to... (extension Translate).<br>- Các thông tin nên/không nên chia sẻ khi giới thiệu về bản thân.",
    "lessonTools": "Codekitten",
    "lessonConcepts": {
        "conceptComputerScience": [
            "ConceptA",
            "ConceptB",
            "ConceptC",
            "ConceptD"
        ],
        "conceptScience": [
            "Concept1",
            "Concept2",
            "Concept3",
            "Concept4"
        ],
        "conceptTech": [
            "--- o ---"
        ],
        "conceptEngineering": [
            "--- o ---"
        ],
        "conceptArt": [
            "--- o ---"
        ],
        "conceptMath": [
            "--- o ---"
        ],
        "conceptSkill": [
            "ConceptI",
            "ConceptII",
            "ConceptIII",
            "ConceptIV"
        ]
    },
    "lessonMaterials": {
        "lessonPlanId": "blg-hp01-b01-lessonplan",
        "slideId": "blg-hp01-b01-slide",
        "summaryId": "blg-hp01-b01-summary",
        "quizId": "blg-hp01-b01-quiz",
        "videoId": "blg-hp01-b01-video"
    },
    "lessonProject": {
        "projectId": "coding-block-animation-0001"
    },
    "materials": {
        "lessonPlan": {
            "materialId": "blg-hp01-b01-lessonplan",
            "lessonName": "Giới thiệu bản thân",
            "materialName": "Lesson Plan - Giới thiệu bản thân",
            "materialType": "lesson-plan",
            "materialLink": "https://teky.edu.vn/blg-hp01-b01-lessonplan"
        },
        "slide": {
            "materialId": "blg-hp01-b01-slide",
            "lessonName": "Giới thiệu bản thân",
            "materialName": "Slide - Giới thiệu bản thân",
            "materialType": "slide",
            "materialLink": "https://teky.edu.vn/blg-hp01-b01-slide"
        },
        "summary": {
            "materialId": "blg-hp01-b01-summary",
            "lessonName": "Giới thiệu bản thân",
            "materialName": "Summary - Giới thiệu bản thân",
            "materialType": "summary",
            "materialLink": "https://teky.edu.vn/blg-hp01-b01-summary"
        },
        "quiz": {
            "materialId": "blg-hp01-b01-quiz",
            "lessonName": "Giới thiệu bản thân",
            "materialName": "Quiz - Giới thiệu bản thân",
            "materialType": "quiz",
            "materialLink": "https://teky.edu.vn/blg-hp01-b01-quiz"
        },
        "video": {
            "materialId": "blg-hp01-b01-video",
            "lessonName": "Giới thiệu bản thân",
            "materialName": "Video - Giới thiệu bản thân",
            "materialType": "video",
            "materialLink": "https://teky.edu.vn/blg-hp01-b01-video"
        }
    },
    "project": {
        "projectId": "coding-block-animation-0001",
        "projectName": "Giới thiệu bản thân",
        "projectDescription": "Một đoạn hoạt hình được tạo với CodeKitten trong đó nhân vật giới thiệu bản thân bằng nhiều ngôn ngữ khác nhau. Tính năng giới thiệu đa ngôn ngữ có được do sử dụng phần mở rộng AI \"Translate\", là một dịch vụ của Google. ",
        "projectRelatedConcepts": [
            "ConceptA",
            "ConceptB",
            "ConceptC",
            "ConceptD",
            "Concept1",
            "Concept2",
            "Concept3",
            "Concept4"
        ],
        "projectTools": [
            "codekitten"
        ],
        "projectInstruction": "https://teky.edu.vn/coding-block-animation-0001",
        "tools": [
            {
                "toolId": "codekitten",
                "toolName": "Code Kitten",
                "toolDescription": "Nền tảng lập trình thân thiện với người mới bắt đầu được thiết kế đặc biệt cho trẻ nhỏ. Nó thường sử dụng các khối hình ảnh và trò chơi để giới thiệu các khái niệm lập trình cơ bản.",
                "toolVersion": "--- o ---",
                "toolTypes": "block-coding"
            }
        ]
    },
    "tools": [
        {
            "toolId": "codekitten",
            "toolName": "Code Kitten",
            "toolDescription": "Nền tảng lập trình thân thiện với người mới bắt đầu được thiết kế đặc biệt cho trẻ nhỏ. Nó thường sử dụng các khối hình ảnh và trò chơi để giới thiệu các khái niệm lập trình cơ bản.",
            "toolVersion": "--- o ---",
            "toolTypes": "block-coding"
        }
      ]
    }
  }
}
</script>

<style scoped>
* {
  margin-left: 20px;
}
  .lessonName{
    color: var(--primary-color);
  }
  .body{
    color: var(--secondary-color);
    font-size: var(--text-title);
  }
  .instruction a{
    color: var(--secondary-color);
    font: bold;
  }
  .link{
    color: var(--primary-color);
    font: bold;
    font-size: var(--text-normal);
  }
  .phara{
    color: var(--black-color);
    font-size: var(--text-normal);
  }
  .concept{
    color: var(--primary-color);
    font-size: 18px;
    font: bold;
  }
</style>
