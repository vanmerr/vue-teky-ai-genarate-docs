<template>
  <div class="body">
    <div class="chat-ai" @click="clickAI">
      <img src="../assets/chat.png" alt="" />
    </div>
    <nav class="navbar" v-if="showAI">
      <!-- logo and login/logout -->
      <div class="navbar-brand">
        <img alt="Teky logo" src="../assets/logo.svg" />
        <button v-if="!userProfile" type="button" class="navbar-login-gg" @click="onLoginGG">Login</button>
        <div v-if="userProfile" class="user-info">
          <span>Hello, {{ userProfile.displayName }}</span>
        </div>
        <div v-if="userProfile" class="user-profile" @mouseover="toggleLogout(true)" @mouseleave="toggleLogout(false)">
          <img :src="userProfile.photoURL" alt="Profile Image" />
          <div v-if="showLogout" class="logout-list">
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
        <div class="select-container" v-if="selectedLesson">
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
              <input 
                type="checkbox" 
                :value="hardness" 
                v-model="selectedHardness"
                @change="updateQuestionCounts(hardness)"
              />
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
              <select 
                v-model="questionCounts[hardness.toLowerCase()]"
                :disabled="selectedHardness.length === 0"
                @change="adjustQuestionCounts(hardness)"
              >
                <option v-for="n in 16" :key="n-1" :value="n-1">{{ n-1 }}</option>
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
      <Lesson id="lesson" v-if="selectedLesson" />
      <ConceptDefinition id="conceptDefinition" v-if="selectedGenerate === '1'" />
      <Quiz id='quiz' v-if="selectedGenerate === '2'" />
      <ProjectInstruction id="projectInstruction" v-if="selectedGenerate === '3'" />
      <Activity id="activity" v-if="selectedGenerate === '4'" />
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
import Level from "./Level.vue";
import services from "@/services";
import { auth, provider } from "../../firebaseConfig"; // Adjust the path according to your project structure
import { signInWithPopup, signOut } from "firebase/auth";

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
      showAI: false,
      showGenerate: false,
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
      questionCounts: {
        easy: 0,
        medium: 0,
        hard: 0
      },
      courses: [],
      levels: [],
      lessons: [],
      userProfile: null,
      showLogout: false,
    };
  },
  async created() {
    await this.fetchCourses();
    this.checkLoginState();
  },
  computed: {
    totalQuestions() {
      return this.questionCounts.easy + this.questionCounts.medium + this.questionCounts.hard;
    },
    isMaxQuestionsReached() {
      return this.totalQuestions >= 30;
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
    onChangeLesson() {
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
    toggleLogout(show) {
      this.showLogout = show;
    },
    async onLoginGG() {
      try {
        const result = await signInWithPopup(auth, provider);
        const googleToken = await result.user.getIdToken();
        const email = result.user.email;
        const displayName = result.user.displayName;
        localStorage.setItem("userToken", googleToken);
        console.log("User signed in with Google:", result.user);
        
        // Fetch user profile
        this.userProfile = result.user;
        this.showLogout = false; // Hide logout initially
        
        // Make a POST request to your backend API
        fetch('https://us-central1-testjsonloop.cloudfunctions.net/app/api/auth/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            googleUser: {
              name: displayName,
              email: email
            },
            googleToken: googleToken
          })
        })
        .then(response => response.json())
        .then(data => {
          console.log('Backend response:', data);
          // Handle further actions if needed
        })
        .catch(error => {
          console.error('Error during sign-in:', error);
        });
      } catch (error) {
        console.error("Error during sign-in:", error);
      }
    },
    checkLoginState() {
      auth.onAuthStateChanged(user => {
        if (user) {
          user.getIdToken().then(token => {
            localStorage.setItem("userToken", token);
            console.log("User is logged in:", user);
            this.userProfile = user;
            this.showLogout = false; // Hide logout initially
          }).catch(error => {
            console.error("Error getting token:", error);
          });
        }
      });
    },
    async onLogout() {
      try {
        await signOut(auth);
        localStorage.removeItem("userToken");
        this.userProfile = null;
        console.log("User logged out");
      } catch (error) {
        console.error("Error during logout:", error);
      }
    },
    updateQuestionCounts(hardness) {
      const lowercaseHardness = hardness.toLowerCase();
      if (this.selectedHardness.includes(hardness)) {
        const availableCount = this.availableQuestionCount(hardness);
        this.questionCounts[lowercaseHardness] = availableCount > 0 ? availableCount : 0;
      } else {
        this.questionCounts[lowercaseHardness] = 0;
      }
      this.adjustTotalQuestions();
    },
    availableQuestionCount(hardness) {
      const currentTotal = this.totalQuestions - this.questionCounts[hardness.toLowerCase()];
      return Math.min(30 - currentTotal, 15);
    },
    adjustQuestionCounts(changedHardness) {
      this.adjustTotalQuestions();
      this.selectedHardness.forEach(hardness => {
        if (hardness !== changedHardness) {
          const availableCount = this.availableQuestionCount(hardness);
          this.questionCounts[hardness.toLowerCase()] = Math.min(
            this.questionCounts[hardness.toLowerCase()],
            availableCount
          );
        }
      });
    },
    adjustTotalQuestions() {
      if (this.totalQuestions > 30) {
        let excess = this.totalQuestions - 30; // Calculate the excess
        for (let i = this.selectedHardness.length - 1; i >= 0; i--) { // Iterate in reverse order
          const hardness = this.selectedHardness[i].toLowerCase(); // Get the hardness
          const reduction = Math.min(excess, this.questionCounts[hardness]); // Reduce the excess
          this.questionCounts[hardness] -= reduction; // Update the question count for the hardness
          excess -= reduction; // Reduce the excess
          if (excess === 0) break; // Stop if we've reduced all excess
        }
      }
    },

    onGenerate() {
      this.showAI = !this.showAI;
      this.showGenerate = !this.showGenerate;
      if (this.selectedGenerate == "1") {
        window.location.href = "#conceptDefinition";
        console.log("Generating with:", {
          course: this.selectedCourse,
          level: this.selectedLevel,
          lesson: this.selectedLesson,
        });
      } else if (this.selectedGenerate == "2") {
        window.location.href = "#quiz";
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
        window.location.href = "#projectInstruction";
        console.log("Generating with:", {
          course: this.selectedCourse,
          level: this.selectedLevel,
          lesson: this.selectedLesson,
        });
      } else if (this.selectedGenerate == "4") {
        window.location.href = "#activity";
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
      this.adjustTotalQuestions();
    }
  }
};
</script>

<style scoped>
.body {
  width: 100%;
  position: relative;
  display: flex;
  justify-content: space-between;
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
    display: none; /* Ẩn thanh cuộn */
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

.user-info{
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
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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

.main {
  width: 700px;
  margin: auto;
}

.hardness, .question-counts {
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
</style>