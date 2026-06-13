// 회장님! 자바스크립트는 달력에 생명을 불어넣는 '전기 배선'입니다요!

const calendarGrid = document.getElementById('calendar-grid');
const currentMonthYear = document.getElementById('current-month-year');
const prevBtn = document.getElementById('prev-month');
const nextBtn = document.getElementById('next-month');
const todayBtn = document.getElementById('today-btn');

let currentDate = new Date(); // 현재 시간 기준점

// 모달 관련 변수들 (비밀 창고 문지기들)
const modalOverlay = document.getElementById('schedule-modal');
const modalDateText = document.getElementById('modal-date');
const scheduleInput = document.getElementById('schedule-input');
const modalSaveBtn = document.getElementById('modal-save');
const modalCancelBtn = document.getElementById('modal-cancel');

let selectedDateKey = null; // 현재 선택한 날짜를 기억하는 수첩

// 일정 저장소 (창고에서 꺼내오기)
let schedules = JSON.parse(localStorage.getItem('claudeCalendarSchedules')) || {};

// 달력을 붕어빵처럼 찍어내는 메인 함수!
function renderCalendar(date) {
    // 1. 기존에 있던 날짜 상자들 싹 다 청소하기 (요일은 남겨야 하니까 .weekday 빼고!)
    const days = calendarGrid.querySelectorAll('.calendar-day, .empty');
    days.forEach(day => day.remove());

    const year = date.getFullYear();
    const month = date.getMonth();

    // 2. 제목 줄에 "몇 년 몇 월"인지 간지나게 쓰기
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    currentMonthYear.textContent = `${monthNames[month]} ${year}`;

    // 3. 이번 달 1일이 무슨 요일인지 알아내기 (빈 칸 채울 때 필요함)
    const firstDayIndex = new Date(year, month, 1).getDay();
    
    // 4. 이번 달이 총 며칠인지 알아내기 (다음 달 0일 = 이번 달 마지막 날)
    const lastDay = new Date(year, month + 1, 0).getDate();

    // 5. 1일 전까지 빈 칸(가짜 상자) 먼저 깔아두기
    for (let i = 0; i < firstDayIndex; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('empty');
        calendarGrid.appendChild(emptyDiv);
    }

    // 6. 1일부터 마지막 날까지 숫자 상자 쫙 뿌리기
    const today = new Date();
    for (let i = 1; i <= lastDay; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day');
        dayDiv.textContent = i;

        // 오늘 날짜면 코랄색 유니폼 입혀주기! (class 추가)
        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayDiv.classList.add('today');
        }

        // 날짜의 고유 열쇠 (예: 2026-06-05)
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

        // 창고에 이 날짜 일정이 있다면? 코랄색 점(Dot)을 붙여줍니다!
        if (schedules[dateKey]) {
            const dot = document.createElement('div');
            dot.classList.add('schedule-dot');
            dayDiv.appendChild(dot);
        }

        // 날짜 상자 누르면 일기장(모달) 띄우기!
        dayDiv.addEventListener('click', () => {
            selectedDateKey = dateKey;
            modalDateText.textContent = `${year}년 ${month + 1}월 ${i}일`;
            scheduleInput.value = schedules[dateKey] || ''; // 기존 일정 불러오기
            modalOverlay.classList.remove('hidden');
            scheduleInput.focus();
        });

        calendarGrid.appendChild(dayDiv);
    }
}

// 처음 화면 켰을 때 달력 한 번 렌더링(그리기)
renderCalendar(currentDate);

// 이전 달 버튼 (-1)
prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
});

// 다음 달 버튼 (+1)
nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
});

// 오늘로 돌아가기 버튼 (시간 리셋)
todayBtn.addEventListener('click', () => {
    currentDate = new Date(); 
    renderCalendar(currentDate);
});

// 모달 닫기 버튼 (취소)
modalCancelBtn.addEventListener('click', () => {
    modalOverlay.classList.add('hidden');
});

// 모달 저장 버튼 (비밀 창고에 저장)
modalSaveBtn.addEventListener('click', () => {
    const text = scheduleInput.value.trim();
    if (text) {
        schedules[selectedDateKey] = text; // 창고에 보관
    } else {
        delete schedules[selectedDateKey]; // 빈칸이면 일정 삭제
    }
    
    // 브라우저 비밀 창고(localStorage)에 자물쇠 채워서 저장!
    localStorage.setItem('claudeCalendarSchedules', JSON.stringify(schedules));
    
    modalOverlay.classList.add('hidden');
    renderCalendar(currentDate); // 점을 다시 찍어야 하니까 달력 새로고침!
});

// 모달 배경 클릭해도 닫히게 센스 추가
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.add('hidden');
    }
});
