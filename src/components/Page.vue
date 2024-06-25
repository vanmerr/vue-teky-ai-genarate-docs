<template>
  <div class="body">
    <nav class="navbar">
      <!-- logo and login/logout -->
      <div class="navbar-brand">
        <img alt="Teky logo" src="../assets/logo.svg" />
        <button type="button" class="navbar-login-gg">Login</button>
      </div>
      <div class="navbar-select">
        <!-- select course -->
        <div class="select-container">
          <select v-model="selectedCourse" @change="onCourseChange">
            <option value="">Select course</option>
            <option
              v-for="course in courses"
              :key="course.id"
              :value="course.id"
            >
              {{ course.name }}
            </option>
          </select>
        </div>
        <!-- select level -->
        <div class="select-container">
          <select
            v-model="selectedLevel"
            :disabled="!selectedCourse"
            @change="onLevelChange"
          >
            <option value="">Select level</option>
            <option
              v-for="level in getLevels(selectedCourse)"
              :key="level.id"
              :value="level.id"
            >
              {{ level.name }}
            </option>
          </select>
        </div>
        <!-- select lesson -->
        <div class="select-container">
          <select v-model="selectedLesson" :disabled="!selectedLevel">
            <option value="">Select lesson</option>
            <option
              v-for="lesson in getLessons(selectedCourse, selectedLevel)"
              :key="lesson.id"
              :value="lesson.id"
            >
              {{ lesson.name }}
            </option>
          </select>
        </div>
        <!-- select generate -->
        <div class="select-container" v-if="selectedLesson">
          <select v-model="selectedGenerate">
            <option value="1">Concept Definition</option>
            <option value="2">Quiz</option>
            <option value="3">Project Instruction</option>
            <option value="4">Activity</option>
          </select>
        </div>
        <!-- select quiz options -->
        <div class="selectQuiz" v-if="selectedGenerate == '2'">
          <div class="type">
            <div class="title">Types</div>
            <div class="group" v-for="type in typequiz" :key="type.id">
              <input
                type="checkbox"
                :value="type.name"
                v-model="selectedTypes"
              />
              <label>{{ type.name }}</label>
            </div>
          </div>
          <div class="number-quiz">
            <div class="title">Number</div>
            <select v-model="selectedNumberQuiz">
              <option v-for="n in 15" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>
          <div class="hardness">
            <div class="title">Hardness</div>
            <div
              class="group"
              v-for="hardness in hardnessLevels"
              :key="hardness"
            >
              <input
                type="checkbox"
                :value="hardness"
                v-model="selectedHardness"
              />
              <label>{{ hardness }}</label>
            </div>
          </div>
        </div>
        <!-- select activity options -->
        <div class="selectActivity" v-if="selectedGenerate == '4'">
          <div class="number-activity">
            <div class="title">Number</div>
            <select v-model="selectedNumberActivyti">
              <option v-for="n in 15" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>
          <div class="activity-description">
            <div class="title">Activity Description</div>
            <textarea
              v-model="activityDescription"
              rows="5"
              spellcheck="false"
            ></textarea>
          </div>
        </div>
        <!-- button generate -->
        <div
          class="selectedGenerate"
          v-if="
            selectedLesson &&
            (selectedGenerate == '1' ||
              selectedGenerate == '3' ||
              (selectedTypes.length > 0 && selectedHardness.length > 0) ||
              selectedGenerate == '4')
          "
        >
          <button type="button" @click="onGenerate">Generate</button>
        </div>
      </div>
    </nav>
    <main class="main">
      <Course />
      <Lesson />
      <ConceptDefinition />
      <ProjectInstruction />
      <Activity />
      <Quiz />
    </main>
  </div>
</template>

<script>
import ConceptDefinition from "./ConceptDefinition.vue";
import Course from "./Course.vue";
import Lesson from "./Lesson.vue";
import Quiz from "./Quiz.vue";
import ProjectInstruction from "./ProjectInstruction.vue";
import Activity from "./Activity.vue";

export default {
  name: "Page",
  components: {
    ConceptDefinition,
    Course,
    Lesson,
    Quiz,
    ProjectInstruction,
    Activity,
  },
  data() {
    return {
      selectedCourse: "",
      selectedLevel: "",
      selectedLesson: "",
      selectedGenerate: "1",
      selectedTypes: [],
      selectedNumberQuiz: 1,
      activityDescription: "",
      selectedNumberActivyti: 1,
      selectedHardness: [],
      typequiz: [
        { id: 1, name: "Multiple Choice" },
        { id: 2, name: "True/False" },
        { id: 3, name: "Short Answer" },
        { id: 4, name: "Fill in the Blanks" },
        { id: 5, name: "Matching" },
        { id: 6, name: "Essay" },
        { id: 7, name: "Diagram Labeling" },
      ],
      hardnessLevels: ["Easy", "Medium", "Hard"],
      courses: [
        {
          id: 1,
          name: "Course 1",
          levels: [
            {
              id: 1,
              name: "Level 1.1",
              lessons: [
                { id: 1, name: "Lesson 1.1.1" },
                { id: 2, name: "Lesson 1.1.2" },
              ],
            },
            {
              id: 2,
              name: "Level 2.1",
              lessons: [
                { id: 3, name: "Lesson 2.1.1" },
                { id: 4, name: "Lesson 2.1.2" },
              ],
            },
          ],
        },
        {
          id: 2,
          name: "Course 2",
          levels: [
            {
              id: 3,
              name: "Level 1.1",
              lessons: [
                { id: 5, name: "Lesson 1.1.1" },
                { id: 6, name: "Lesson 1.1.2" },
              ],
            },
            {
              id: 4,
              name: "Level 2.1",
              lessons: [
                { id: 7, name: "Lesson 2.1.1" },
                { id: 8, name: "Lesson 2.1.2" },
              ],
            },
          ],
        },
      ],
    };
  },
  methods: {
    onCourseChange() {
      this.selectedLevel = "";
      this.selectedLesson = "";
    },
    onLevelChange() {
      this.selectedLesson = "";
    },
    getLevels(courseId) {
      const course = this.courses.find(
        (course) => course.id === parseInt(courseId)
      );
      return course ? course.levels : [];
    },
    getLessons(courseId, levelId) {
      const course = this.courses.find(
        (course) => course.id === parseInt(courseId)
      );
      if (!course) return [];
      const level = course.levels.find(
        (level) => level.id === parseInt(levelId)
      );
      return level ? level.lessons : [];
    },
    onGenerate() {
      if (this.selectedGenerate == "1") {
        console.log("Generating with:", {
          course: this.selectedCourse,
          level: this.selectedLevel,
          lesson: this.selectedLesson,
        });
      } else if (this.selectedGenerate == "2") {
        console.log("Generating with:", {
          course: this.selectedCourse,
          level: this.selectedLevel,
          lesson: this.selectedLesson,
          generate: this.selectedGenerate,
          types: this.selectedTypes,
          numberQuiz: this.selectedNumberQuiz,
          hardness: this.selectedHardness,
        });
      } else if (this.selectedGenerate == "3") {
        console.log("Generating with:", {
          course: this.selectedCourse,
          level: this.selectedLevel,
          lesson: this.selectedLesson,
        });
      } else if (this.selectedGenerate == "4") {
        console.log("Generating with:", {
          course: this.selectedCourse,
          level: this.selectedLevel,
          lesson: this.selectedLesson,
          numberActivity: this.selectedNumberActivyti,
          activityDescription: this.activityDescription,
        });
      }
    },
  },
  mounted() {
    this.selectedCourse = "";
    this.selectedGenerate = "1";
  },
};
</script>

<style scoped>
.body {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.navbar {
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
  border-radius: 5px;
  width: 400px;
  background-color: var(--white-color);
  overflow: hidden;
}

.navbar-brand {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}
.navbar-brand img {
  margin-left: 5px;
}
.navbar-brand button {
  margin-right: 5px;
  width: 80px;
  height: 40px;
  font-size: var(--text-subtitle);
  background-color: var(--primary-color);
  color: var(--white-color);
  cursor: pointer;
}

.navbar-select {
  width: 100%;
}
.select-container,
.selectedGenerate,
.selectQuiz,
.selectActivity {
  width: 95%;
  margin: 10px auto;
  height: 40px;
}
.selectQuiz,
.selectActivity {
  display: flex;
  justify-content: space-between;
  height: auto;
}
.select-container select {
  width: 100%;
  height: 100%;
  background-color: var(--white-color);
  border: 1px solid var(--secondary-color);
  border-radius: 5px;
  font-size: var(--text-subtitle);
  color: var(--secondary-color);
  cursor: pointer;
}

.selectedGenerate {
  display: flex;
  align-items: center;
  justify-content: end;
}

.selectedGenerate button {
  width: 80px;
  height: 40px;
  font-size: var(--text-subtitle);
  font-weight: var(--font-weight-title);
  color: var(--white-color);
  background-color: var(--secondary-color);
  cursor: pointer;
}
.select-container select:hover {
  opacity: 0.9;
}

.selectQuiz .title,
.selectActivity .title {
  font-size: var(--text-subtitle);
  margin-bottom: 5px;
  font-weight: var(--font-weight-title);
  color: var(--text-primary-color);
}

.selectQuiz .group,
.selectActivity .group {
  display: flex;
  align-items: center;
}

.selectQuiz .group input {
  margin-right: 5px;
  cursor: pointer;
}

.selectQuiz .number-quiz select,
.selectActivity .number-activity select {
  width: 80px;
  height: 40px;
  border: 1px solid var(--secondary-color);
  border-radius: 5px;
  font-size: var(--text-subtitle);
  color: var(--secondary-color);
  cursor: pointer;
}
.selectActivity .activity-description textarea {
  width: 250px;
  color: var(--text-primary-color);
  border: 1px solid var(--text-secondary-color);
  /* &::-webkit-scrollbar {
    width: 0px; /* Độ rộng của thanh cuộn 
    } */
}
.selectActivity .activity-description textarea::-webkit-scrollbar {
  width: 0px;
}

.main {
  width: 700px;
}
</style>
