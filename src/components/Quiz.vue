<template>
    <div class="quiz" v-if="quiz.length > 0">
      <table>
        <thead>
          <tr>
            <th class="stt">STT</th>
            <th class="type">Loại câu hỏi</th>
            <th class="questionDifficulty">Độ khó</th>
            <th class="question">Câu hỏi</th>
            <th class="answer">Đáp án A</th>
            <th class="answer">Đáp án B</th>
            <th class="answer">Đáp án C</th>
            <th class="correctAnswer">Đáp án đúng</th>
          </tr>
        </thead>
        <tbody>
          <tr  v-for="question in quiz">
            <td class="stt">{{ question.ID }}</td>
            <td class="type">{{ question.questionType }}</td>
            <td class="questionDifficulty">{{ question.questionDifficulty }}</td>
            <td class="question">{{ question.questionText }}</td>
            <td class="answer">{{ question.answer1}}</td>
            <td class="answer">{{ question.answer2}}</td>
            <td class="answer">{{ question.answer3}}</td>
            <td class="correctAnswer">{{ question.correctAnswer}}</td>
          </tr>
        </tbody>
      </table>
    </div>
</template>

<script>
export default {
  name: 'Quiz',
  props: {
    quiz: []
  }
}
</script>

<style scoped>
.quiz{
  width: 100%;
  overflow-x: scroll;
  &::-webkit-scrollbar {
    width: 0px;
    /* Độ rộng của thanh cuộn */
  }
}
table {
  min-width: 1230px;
  border-collapse: collapse;
}

thead {
  background-color: #f2f2f2;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center
}


th {
  background-color: #4CAF50;
  color: white;
}

tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

tbody tr:hover {
  background-color: #ddd;
}

.stt{
  width: 80px;
}

.type{
  width: 150px;
}

.questionDifficulty{
  width: 200px;
}
.question{
  width: 500px;
}

.answer,.correctAnswer{
  width: 200px;
}
</style>

