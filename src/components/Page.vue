<template>
  <div class="body">
    <div class="chat-ai" @click="clickAI">
      <img src="../assets/chat.png" alt="" />
    </div>
    <nav class="navbar" v-if="showAI">
      <!-- logo and login/logout -->
      <div class="navbar-brand">
        <img alt="Teky logo" src="../assets/logo.svg" />
        <button v-if="!user.info" type="button" class="navbar-login-gg" @click="onLoginGG">Login</button>
        <div v-if="user.info" class="user-profile">
          <span>Hello, {{ user.info.displayName }}</span>
          <img :src="user.info.photoURL" alt="Profile Image" />
          <div class="logout-list">
            <ul>
              <li @click="onLogout">Logout</li>
            </ul>
          </div>
        </div>

      </div>
      <div class="navbar-select">
        <!-- select course -->
        <div class="select-container">
          <select v-model="selectedCourse" @change="onCourseChange">
            <option value="">Select course</option>
            <option v-for="course in courses" :key="course.courseId" :value="course.courseId">
              {{ course.courseName }}
            </option>
          </select>
        </div>
        <!-- select level -->
        <div class="select-container">
          <select v-model="selectedLevel" :disabled="!selectedCourse" @change="onLevelChange">
            <option value="">Select level</option>
            <option v-for="level in levels" :key="level.levelId" :value="level.levelId">
              {{ level.levelName }}
            </option>
          </select>
        </div>
        <!-- select lesson -->
        <div class="select-container">
          <select v-model="selectedLesson" :disabled="!selectedLevel" @change="onChangeLesson">
            <option value="">Select lesson</option>
            <option v-for="lesson in lessons" :key="lesson.lessonId" :value="lesson.lessonId">
              {{ lesson.lessonName }}
            </option>
          </select>
        </div>
        <!-- select generate -->
        <div class="select-container" v-if="selectedLesson && user.role === 'admin'">
          <select v-model="selectedGenerate" @change="onChangeGenerate">
            <option value="">Generate</option>
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
              <input type="checkbox" :value="type.name" v-model="selectedTypes" />
              <label>{{ type.name }}</label>
            </div>
          </div>
          <div class="hardness">
            <div class="title">Hardness</div>
            <div class="group" v-for="hardness in hardnessLevels" :key="hardness">
              <input type="checkbox" :value="hardness" v-model="selectedHardness"
                @change="updateQuestionCounts(hardness)" />
              <label>{{ hardness }}</label>
            </div>
          </div>

          <div class="question-counts">
            <div class="title">Number of Questions</div>
            <div v-if="selectedHardness.length === 0" class="empty-message">
              Select hardness levels to set question counts
            </div>
            <div class="count-group" v-for="hardness in selectedHardness" :key="hardness">
              <label>{{ hardness }}:</label>
              <select v-model="questionCounts[hardness.toLowerCase()]" :disabled="selectedHardness.length === 0"
                @change="adjustQuestionCounts(hardness)">
                <option v-for="n in availableQuestionCount(hardness)" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>
          </div>
        </div>
        <div v-if="isMaxQuestionsReached" class="error-message">
          Maximum number of questions (30) reached.
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
            <textarea v-model="activityDescription" rows="5" spellcheck="false"></textarea>
          </div>
        </div>
        <!-- button generate -->
        <div class="selectedGenerate" v-if="
          selectedLesson &&
          (selectedGenerate == '1' ||
            selectedGenerate == '3' ||
            (selectedTypes.length > 0 && selectedHardness.length > 0) ||
            activityDescription.length > 0)
        ">
          <button type="button" @click="onGenerate">Generate</button>
        </div>
      </div>
    </nav>
    <main class="main">
      <Course id="course" v-if="selectedCourse" :course="course" />
      <Level id="level" v-if="selectedLevel" :level="level" />
      <Lesson id="lesson" v-if="selectedLesson" :lesson="lesson" />
    </main>
    <footer id="generate" class="footer" v-if="selectedGenerate">
      <div class="creating" v-if="creating">
        <div class="loading">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <ConceptDefinition id="conceptDefinition" v-if="selectedGenerate === '1'" />
      <Quiz id='quiz' v-if="selectedGenerate === '2'" :quiz="quiz" />
      <ProjectInstruction id="projectInstruction" v-if="selectedGenerate === '3'" />
      <Activity id="activity" v-if="selectedGenerate === '4'" />
    </footer>
  </div>
</template>

<script>
import ConceptDefinition from "./ConceptDefinition.vue";
import Course from "./Course.vue";
import Lesson from "./Lesson.vue";
import Quiz from "./Quiz.vue";
import ProjectInstruction from "./ProjectInstruction.vue";
import Activity from "./Activity.vue";
import Level from "./Level.vue";
import services from "@/services";
import { auth, provider } from "../../firebaseConfig"; // Adjust the path according to your project structure
import { signInWithPopup, signOut, signInWithCredential, GoogleAuthProvider } from "firebase/auth";

export default {
  name: "Page",
  components: {
    ConceptDefinition,
    Course,
    Lesson,
    Quiz,
    ProjectInstruction,
    Activity,
    Level,
  },
  data() {
    return {
      creating: false,
      showAI: false,
      selectedCourse: "",
      selectedLevel: "",
      selectedLesson: "",
      selectedGenerate: "1",
      selectedTypes: [],
      selectedNumberQuiz: 1,
      activityDescription: "",
      selectedNumberActivyti: 1,
      selectedHardness: [],
      course: {},
      level: {},
      quiz: Array,
      lesson: {},
      typequiz: [
        { id: 1, name: "True/False" },
        { id: 2, name: "Multiple Choice" },
        { id: 3, name: "Multiple Response" },
        { id: 4, name: "Type In" },
        { id: 5, name: "Matching Graded" },
        { id: 6, name: "Sequence" },
        { id: 7, name: "Numeric" },
        { id: 8, name: "Yes/No" },
        { id: 9, name: "Pick One" },
        { id: 10, name: "Pick Many" },
        { id: 11, name: "Short Answer" },
        { id: 12, name: "Numeric Survey" },
        { id: 13, name: "Ranking" },
        { id: 14, name: "Matching Survey" },
        { id: 15, name: "Essay" },
        { id: 16, name: "Info Slide" },
        { id: 17, name: "Draw the Words" },
        { id: 18, name: "Hotspot Question" },
        { id: 19, name: "Fill in the Blanks" }
      ],
      hardnessLevels: ["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create", "Previous Concepts"],
      questionCounts: {
        remember: 0,
        understand: 0,
        apply: 0,
        analyze: 0,
        evaluate: 0,
        create: 0,
        previousconcepts: 0,
      },
      courses: [],
      levels: [],
      lessons: [],
      user: {
        info: null,
        role: "user"
      },
    };
  },
  async created() {
    await this.fetchCourses();
    await this.autoLogin();
  },
  computed: {
    totalQuestions() {
      return Object.values(this.questionCounts).reduce((total, count) => total + count, 0);
    },
    isMaxQuestionsReached() {
      return this.totalQuestions > 30;
    }
  },
  methods: {
    clickAI() {
      this.showAI = !this.showAI;
    },
    async onCourseChange() {
      this.selectedLevel = "";
      this.selectedLesson = "";
      this.selectedGenerate = "";
      await Promise.all([this.fetchLevels(), this.fetchCourse()]);
      window.location.href = "#course";
    },
    async onLevelChange() {
      this.selectedLesson = "";
      this.selectedGenerate = "";
      await Promise.all([this.fetchLessons(), this.fetchLevel()]);
      window.location.href = "#level";
    },
    async onChangeLesson() {
      await this.fetchLesson();
      window.location.href = "#lesson";
    },
    async fetchCourses() {
      try {
        this.courses = await services.getCourses();
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    },
    async fetchLevels() {
      try {
        this.levels = await services.getLevels(this.selectedCourse);
      } catch (error) {
        console.error('Error fetching levels:', error);
      }
    },
    async fetchLessons() {
      try {
        this.lessons = await services.getLessons(this.selectedCourse, this.selectedLevel);
      } catch (error) {
        console.error('Error fetching lessons:', error);
      }
    },
    async fetchCourse() {
      try {
        this.course = await services.getCourse(this.selectedCourse);
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    },
    async fetchLevel() {
      try {
        this.level = await services.getLevel(this.selectedCourse, this.selectedLevel);
      } catch (error) {
        console.error('Error fetching level:', error);
      }
    },
    async fetchLesson() {
      try {
        this.lesson = await services.getLesson(this.selectedCourse, this.selectedLevel, this.selectedLesson);
        console.log(this.lesson);
      } catch (error) {
        console.error('Error fetching lessons:', error);
      }
    },
    async onLoginGG() {
      try {
        const result = await signInWithPopup(auth, provider);
        this.user.info = auth.currentUser;
        localStorage.setItem("token", this.user.info.accessToken);
        localStorage.setItem("idToken", result._tokenResponse.oauthIdToken);

        console.log(result);
        // Make a POST request to your backend API
        const res = await services.sendDataLoginGoogle({
          googleUser:
          {
            name: this.user.info.displayName,
            email: this.user.info.email
          },
          googleToken: this.user.info.accessToken
        });
        this.user.role = res.user.role;
      } catch (error) {
        console.log("Error during sign-in:", error);
      }
    },
    async onLogout() {
      try {
        await signOut(auth);
        localStorage.removeItem("token");
        this.user = { info: null, role: "user" };
      } catch (error) {
        console.error("Error during logout:", error);
      }
    },
    async autoLogin() {
      const idToken = localStorage.getItem("idToken");
      const accessToken = localStorage.getItem("token");
      if (idToken && accessToken) {
        const credential =  GoogleAuthProvider.credential(idToken);

        const googleLogin = await signInWithCredential(auth, credential);
        this.user.info = googleLogin.user;
        const res = await services.sendDataLoginGoogle({
          googleUser:
          {
            name: this.user.info.displayName,
            email: this.user.info.email
          },
          googleToken: this.user.info.accessToken
        });
        this.user.role = res.user.role;
      }
    },
    updateQuestionCounts(hardness) {
      const lowercaseHardness = hardness.toLowerCase();
      if (this.selectedHardness.includes(hardness)) {
        this.questionCounts[lowercaseHardness] = 1; // Set minimum to 1
        this.adjustQuestionCounts();
      } else {
        this.questionCounts[lowercaseHardness] = 0;
      }
    },
    adjustQuestionCounts() {
      const totalSelectedQuestions = Object.values(this.questionCounts).reduce((total, count) => total + count, 0);
      if (totalSelectedQuestions > 30) {
        let excess = totalSelectedQuestions - 30; // Calculate the excess
        const sortedHardness = Object.keys(this.questionCounts).sort((a, b) => this.questionCounts[b] - this.questionCounts[a]);
        for (let hardness of sortedHardness) {
          if (excess <= 0) break;
          const reduction = Math.min(excess, this.questionCounts[hardness] - 1);
          this.questionCounts[hardness] -= reduction;
          excess -= reduction;
        }
      }
    },
    availableQuestionCount(hardness) {
      const currentTotal = this.totalQuestions - this.questionCounts[hardness.toLowerCase()];
      const availableCount = Math.min(30 - currentTotal, 15);
      return Array.from({ length: availableCount + 1 }, (_, i) => i); // Tạo mảng từ 0 đến availableCount
    },
    async onGenerate() {
      this.showAI = !this.showAI;
      this.creating = true;
      this.quiz = [];
      window.location.href = "#generate";
      if (this.selectedGenerate == "1") {
        console.log("Generating with:", {
          course: this.selectedCourse,
          level: this.selectedLevel,
          lesson: this.selectedLesson,
        });
      } else if (this.selectedGenerate == "2") {
        const token = localStorage.getItem("token");
        const result = await services.createQuiz(token, {
          courseId: this.selectedCourse,
          levelId: this.selectedLevel,
          lessonId: this.selectedLesson,
          questionTypes: this.selectedTypes,
          rememberCheckQuestionNum: this.questionCounts.remember,
          understandCheckQuestionNum: this.questionCounts.understand,
          applyCheckQuestionNum: this.questionCounts.apply,
          analyzeCheckQuestionNum: this.questionCounts.analyze,
          evaluateCheckQuestionNum: this.questionCounts.evaluate,
          createCheckQuestionNum: this.questionCounts.create,
          previousConcepts: this.questionCounts.previousconcepts
        });
        console.log("Quiz data being sent to API:", {
          courseId: this.selectedCourse,
          levelId: this.selectedLevel,
          lessonId: this.selectedLesson,
          questionTypes: this.selectedTypes,
          rememberCheckQuestionNum: this.questionCounts.remember,
          understandCheckQuestionNum: this.questionCounts.understand,
          applyCheckQuestionNum: this.questionCounts.apply,
          analyzeCheckQuestionNum: this.questionCounts.analyze,
          evaluateCheckQuestionNum: this.questionCounts.evaluate,
          createCheckQuestionNum: this.questionCounts.create,
          previousConcepts: this.questionCounts.previousconcepts
        });
        this.quiz = result;
        console.log(result);
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
      this.creating = false;
    },
  },
  mounted() {
    this.selectedCourse = "";
    this.selectedGenerate = "";
  },
  watch: {
    selectedHardness(newVal, oldVal) {
      // When a hardness is deselected, set its count to 0
      const deselectedHardness = oldVal.find(h => !newVal.includes(h));
      if (deselectedHardness) {
        this.questionCounts[deselectedHardness.toLowerCase()] = 0;
      }
      // Redistribute questions when a new hardness is selected
      this.adjustQuestionCounts();
    }
  }
};
</script>

<style scoped>
.body {
  width: 100%;
  position: relative;
}

.chat-ai {
  position: fixed;
  bottom: 50px;
  right: 50px;
  width: 75px;
  height: 75px;
  z-index: 9999;
  overflow: hidden;
  border-radius: 50%;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
  }
}

.navbar {
  z-index: 9999;
  position: fixed;
  bottom: 125px;
  right: 50px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
  border-radius: 5px;
  width: 400px;
  height: 400px;
  background-color: var(--background-color);
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
    /* Ẩn thanh cuộn */
  }
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

.user-profile {
  display: flex;
  align-items: center;
  position: relative;
  right: 10px;
}

.user-profile img {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  cursor: pointer;
}

.user-info {
  margin-right: 10px;
  font-family: 'Metropolis', sans-serif;
  font-size: var(--text-subtitle);
}

.user-info {
  font-family: 'Metropolis', sans-serif;
  font-size: var(--text-subtitle);
  margin-left: auto;
}

.logout-list {
  position: absolute;
  bottom: -40px;
  right: 0;
  width: 80px;
  background-color: var(--background-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  display: none;
}

.user-profile:hover .logout-list {
  display: block;
}

.logout-list ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.logout-list ul li {
  padding: 10px;
  cursor: pointer;
}

.logout-list ul li:hover {
  background-color: #f0f0f0;
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
  justify-content: center;
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

  &::-webkit-scrollbar {
    width: 0px;
    /* Độ rộng của thanh cuộn */
  }
}

.main,
.footer {
  width: 700px;
  margin: auto;
  margin-bottom: 50px;
}

.footer {
  min-height: 200px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
  border-radius: 10px;
}

@media screen and (max-width: 575px) {
  .chat-ai {
    right: 15px;
    bottom: 15px;
    width: 50px;
    height: 50px;
  }

  .navbar {
    width: 95%;
    right: 10px;
    bottom: 40px;
  }

  .main,
  .footer {
    width: 95%;
    margin: auto;
  }
}

.hardness,
.question-counts {
  width: 100px;
}

.question-counts .title,
.hardness .title {
  font-size: var(--text-subtitle);
  margin-bottom: 10px;
  font-weight: var(--font-weight-title);
  color: var(--text-primary-color);
}

.hardness .group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.hardness .group input {
  margin-right: 10px;
}

.count-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.count-group label {
  margin-right: 10px;
  width: 60px;
}

.count-group select {
  width: 60px;
}

.empty-message {
  font-style: italic;
  color: var(--text-secondary-color);
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}

.creating {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading {
  --speed-of-animation: 0.9s;
  --gap: 6px;
  --first-color: #4c86f9;
  --second-color: #49a84c;
  --third-color: #f6bb02;
  --fourth-color: #f6bb02;
  --fifth-color: #2196f3;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  gap: 6px;
  height: 100px;
}


.loading span {
  width: 4px;
  height: 50px;
  background: var(--first-color);
  animation: scale var(--speed-of-animation) ease-in-out infinite;
}

.loading span:nth-child(2) {
  background: var(--second-color);
  animation-delay: -0.8s;
}

.loading span:nth-child(3) {
  background: var(--third-color);
  animation-delay: -0.7s;
}

.loading span:nth-child(4) {
  background: var(--fourth-color);
  animation-delay: -0.6s;
}

.loading span:nth-child(5) {
  background: var(--fifth-color);
  animation-delay: -0.5s;
}

@keyframes scale {

  0%,
  40%,
  100% {
    transform: scaleY(0.05);
  }

  20% {
    transform: scaleY(1);
  }
}
</style>