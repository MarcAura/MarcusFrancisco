from pathlib import Path

# Sample data for the coursework items
courses = [
    ("EE 550LEC", "Photovoltaic Technology and Applications", "Spring 2025", "In Progress", "3.00", "In Progress"),
    ("EE 559LEC", "Control and Applications of Power Electronics", "Spring 2025", "In Progress", "3.00", "In Progress"),
    ("EE 616TUT", "Tech, Synth, and Comm", "Spring 2025", "In Progress", "", "In Progress"),
    ("MUS 341LAB", "UB Chamber Singers", "Spring 2025", "In Cart", "2.00", "In Cart"),
    ("MUS 464STU", "Organ", "Spring 2025", "In Cart", "4.00", "In Cart"),
    ("IE 512LEC", "Decision Analysis", "Winter 2025", "A", "3.00", "Taken"),
    ("EE 519LEC", "Industrial Control Systems", "Fall 2024", "A", "3.00", "Taken"),
    ("EE 526LEC", "Wearable & Implantable Sensors", "Fall 2024", "A", "3.00", "Taken"),
    ("EE 545LEC", "Prin Cellular Comm Net", "Fall 2024", "A", "3.00", "Taken"),
    ("EE 550LEC", "Digital Integrated Circuits", "Fall 2024", "A-", "3.00", "Taken"),
    ("MUS 341LAB", "UB Chamber Singers", "Fall 2024", "A", "2.00", "Taken"),
    ("MUS 563TUT", "Organ", "Fall 2024", "A", "2.00", "Taken"),
    ("EE 494SEM", "Sr Capstone Grp Des Proj", "Spring 2024", "A", "3.00", "Taken"),
    ("EE 591LEC", "Analog Integrated Circuits", "Spring 2024", "A-", "3.00", "Taken"),
    ("MUS 105LAB", "Mus Theory, Analysis, Aural 1", "Spring 2024", "A", "1.00", "Taken"),
    ("MUS 105LEC", "Mus Theory, Analysis, Aural 1", "Spring 2024", "A", "3.00", "Taken"),
    ("MUS 214LEC", "Music History Survey 2", "Spring 2024", "A", "3.00", "Taken"),
    ("MUS 338LAB", "UB Symphony Orchestra", "Spring 2024", "B+", "2.00", "Taken"),
    ("MUS 351LAB", "University Choir", "Spring 2024", "A", "2.00", "Taken"),
    ("MUS 464STU", "Organ", "Spring 2024", "A", "2.00", "Taken"),
    ("MUS 490STU", "French Horn", "Spring 2024", "A", "2.00", "Taken"),
    ("EE 408SEM", "Senior Seminar", "Fall 2023", "A", "1.00", "Taken"),
    ("EE 476LEC", "High Voltage Engineering", "Fall 2023", "A", "3.00", "Taken"),
    ("EE 496TUT", "EE Internship", "Fall 2023", "A", "3.00", "Taken"),
    ("EE 541LEC", "Machine Learning over Wireless Edge Networks", "Fall 2023", "A", "3.00", "Taken"),
    ("EE 553LLB", "Microelectronic Fab Lab", "Fall 2023", "A", "3.00", "Taken"),
    ("MUS 151LAB", "University Choir", "Fall 2023", "R", "2.00", "Taken"),
    ("MUS 338LAB", "UB Symphony Orchestra", "Fall 2023", "A", "2.00", "Taken"),
    ("MUS 351LAB", "University Choir", "Fall 2023", "A", "2.00", "Taken"),
    ("EE 311LLB", "Electronic Devs & Circs 2", "Spring 2023", "A", "3.00", "Taken"),
    ("EE 336LEC", "Fundamentals of Energy Systems", "Spring 2023", "A", "3.00", "Taken"),
    ("EE 353LLB", "Electronic Circuits", "Spring 2023", "A", "3.00", "Taken"),
    ("EE 379LLB", "Embedded Systems and Applicati", "Spring 2023", "A", "3.00", "Taken"),
    ("EE 383LR", "Communications Systems I", "Spring 2023", "A", "3.00", "Taken"),
    ("EE 496TUT", "EE Internship", "Spring 2023", "A", "3.00", "Taken"),
    ("UBC 399MNT", "UB Curriculum Capstone", "Spring 2023", "A", "1.00", "Taken"),
    ("EE 305LEC", "Applied Probability", "Fall 2022", "B+", "4.00", "Taken"),
    ("EE 310LR", "Electronic Devs & Circs 1", "Fall 2022", "A", "3.00", "Taken"),
    ("EE 324LLB", "Applied Electromagnetics", "Fall 2022", "A", "4.00", "Taken"),
    ("EE 352LLB", "Intro Electronics Lab", "Fall 2022", "A", "3.00", "Taken"),
    ("EE 478LLB", "HDL Digital Des Prog Logic", "Fall 2022", "A", "3.00", "Taken"),
    ("EAS 230LLB", "Engineering Computations", "Spring 2022", "A", "3.00", "Taken"),
    ("EE 205LR", "Signals and Systems", "Spring 2022", "A", "4.00", "Taken"),
    ("HIS 293LEC", "The Second World War", "Spring 2022", "A", "3.00", "Taken"),
    ("MTH 241LR", "College Calculus 3", "Spring 2022", "A", "4.00", "Taken"),
    ("PHY 207LR", "General Physics 3", "Spring 2022", "A", "4.00", "Taken"),
    ("PHY 257LAB", "General Physics 3 Lab", "Spring 2022", "A", "1.00", "Taken"),
    ("EAS 360LEC", "STEM Communications", "Fall 2021", "A", "3.00", "Taken"),
    ("EE 202LR", "Circuit Analysis", "Fall 2021", "A", "3.00", "Taken"),
    ("MTH 306LR", "Intro Diff Equations", "Fall 2021", "A", "4.00", "Taken"),
    ("PHY 108LR", "General Physics 2", "Fall 2021", "A", "4.00", "Taken"),
    ("PHY 158LAB", "General Physics Lab 2", "Fall 2021", "A", "1.00", "Taken"),
    ("APY 106LEC", "Intro:Cultural Anthropology", "Spring 2021", "A", "3.00", "Taken"),
    ("EAS 202SEM", "Impact On Society", "Spring 2021", "A", "1.00", "Taken"),
    ("EAS 240LEC", "Introduction to Programming", "Spring 2021", "A", "3.00", "Taken"),
    ("ECO 182LD", "Intro to Microeconomics", "Spring 2021", "A", "4.00", "Taken"),
    ("EE 178LLB", "Digital Principles", "Spring 2021", "A", "4.00", "Taken"),
    ("MTH 142LR", "College Calculus 2", "Spring 2021", "A-", "4.00", "Taken"),
    ("APC 999TR", "Elective credit for AP exams", "Fall 2020", "TP", "3.00", "Transferred"),
    ("APC 999TR", "Elective credit for AP exams", "Fall 2020", "TP", "3.00", "Transferred"),
    ("CHE 107LR", "Gen Chem for Engineers I", "Fall 2020", "B+", "3.50", "Taken"),
    ("CHE 127LAB", "General Chem for Engineers 1", "Fall 2020", "A", "0.50", "Taken"),
    ("DMS 220LEC", "Machines, Codes and Cultures", "Fall 2020", "A", "4.00", "Taken"),
    ("EAS 199SL", "UB Seminar (Engineering Principles)", "Fall 2020", "A", "3.00", "Taken"),
    ("MTH 141LR", "College Calculus 1", "Fall 2020", "A", "4.00", "Taken"),
    ("PHY 107LR", "General Physics 1", "Fall 2020", "TP", "4.00", "Transferred"),
    ("STA 119LEC", "Statistical Methods", "Fall 2020", "TP", "3.00", "Transferred"),
    ("STA 119REC", "Statistical Methods", "Fall 2020", "TP", "1.00", "Transferred")
]

def create_course_html(course):
    course_id = course[0].lower().replace(" ", "").replace("(", "").replace(")", "")
    return f"""
<!-- Coursework Row -->
<section id="course-{course_id}" class="coursework-item" onclick="toggleCoursework(this)">
    <div class="course-summary">
        <span>{course[0]}</span>
        <span>{course[1]}</span>
        <span>{course[2]}</span>
        <span>{course[3]}</span>
        <span>{course[4]}</span>
        <span>{course[5]}</span>
    </div>
    <div class="course-content">
        <p class="justified-text">
            {course[0]} – {course[1]} (description not available).
        </p>
        <p class="justified-text">
            This course is part of my academic journey at UB. More reflections will be added here.
        </p>
        <a href="https://catalog.buffalo.edu/courses" target="_blank" class="learn-more-link">Learn More ↗</a>
    </div>
</section>
"""

# Compose all entries into one HTML block
html_output = "\n".join(create_course_html(course) for course in courses)

# Save to file
output_path = Path("/mnt/data/coursework_items.html")
output_path.write_text(html_output)

output_path
