 # QCM Java
 
This is a simple project for quizzes regarding Java 21

For details about the project see [CLAUDE.md](CLAUDE.md)

## How to add a new quiz

* generate a json file with the questions and answers, you can re-use [exam_template.json](data/exam_template.json) as example
* refer your json file in [index.html](index.html)

```
<div class="exam-card compact">
    <div class="exam-header">
        <div class="exam-title-group">
            <span class="exam-number">H2</span>
            <h4>Examen blanc 2</h4>
        </div>
    </div>
    <p class="exam-desc">20 questions</p>
    <div class="exam-actions">
        <a class="btn-mini" href="exam.html?exam=exam6.json&mode=exam">Examen</a>
        <a class="btn-mini outline" href="exam.html?exam=exam6.json&mode=train">Entraînement</a>
    </div>
</div>
```
