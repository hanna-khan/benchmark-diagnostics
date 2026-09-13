const labReports = [
    {
        month: 'August',
        year: 2026,
        title: 'The Lab Report',
        file: '../downloads/lab-reports/The Lab Report August 2026.pdf'
    },
    {
        month: 'July',
        year: 2026,
        title: 'The Lab Report',
        file: '../downloads/lab-reports/The Lab Report July 2026.pdf'
    },
    {
        month: 'June',
        year: 2026,
        title: 'The Lab Report',
        file: '../downloads/lab-reports/The Lab Report_ June 2026.pdf'
    },
    {
        month: 'May',
        year: 2026,
        title: 'The Lab Report',
        file: '../downloads/lab-reports/The Lab Report May 2026.pdf'
    },
    {
        month: 'April',
        year: 2026,
        title: 'The Lab Report',
        file: '../downloads/lab-reports/The Lab Report_ April 2026.pdf'
    },
    {
        month: 'March',
        year: 2026,
        title: 'The Lab Report',
        file: '../downloads/lab-reports/The Lab Report_ March 2026.pdf'
    },
    {
        month: 'February',
        year: 2026,
        title: 'The Lab Report',
        file: '../downloads/lab-reports/The Lab Report_ February 2026.pdf'
    },
    {
        month: 'January',
        year: 2026,
        title: 'The Lab Report',
        file: '../downloads/lab-reports/The Lab Report_ January 2026.pdf'
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const reportsGrid = document.querySelector('.monthly-reports-grid');
    const toggleButton = document.querySelector('.monthly-reports-toggle');
    const initialReportCount = 4;
    let showingAllReports = false;

    if (!reportsGrid || !toggleButton) {
        return;
    }

    const renderReports = () => {
        reportsGrid.innerHTML = labReports.map((report, index) => {
            const reportLabel = `${report.month} ${report.year} Lab Report`;
            const hiddenClass = index >= initialReportCount && !showingAllReports
                ? ' monthly-report-hidden'
                : '';
            const revealedClass = index >= initialReportCount && showingAllReports
                ? ' monthly-report-revealed'
                : '';

            return `
                <article class="research-card${hiddenClass}${revealedClass}">
                    <div class="research-card-icon" aria-hidden="true">▥</div>
                    <h3>${report.month} ${report.year}</h3>
                    <p>${report.title}</p>
                    <a
                        href="${encodeURI(report.file)}"
                        class="button button-small button-outline"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="View ${reportLabel}"
                    >
                        View Report
                    </a>
                </article>
            `;
        }).join('');

        toggleButton.textContent = showingAllReports
            ? 'Show Recent Reports'
            : 'View All Lab Reports';
        toggleButton.setAttribute('aria-expanded', String(showingAllReports));
    };

    toggleButton.addEventListener('click', () => {
        showingAllReports = !showingAllReports;
        renderReports();

        if (!showingAllReports) {
            document.querySelector('.monthly-reports')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });

    renderReports();
});
