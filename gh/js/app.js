// app.js
// mohan chinnappan
//----------------
document.addEventListener('DOMContentLoaded', (event) => {
            // Load stored values
            if (localStorage.getItem('github_repo')) {
                document.getElementById('github_repo').value = localStorage.getItem('github_repo');
            }
            if (localStorage.getItem('review')) {
                document.getElementById('review').value = localStorage.getItem('review');
            }
            if (localStorage.getItem('reviewed_by')) {
                document.getElementById('reviewed_by').value = localStorage.getItem('reviewed_by');
            }
            if (localStorage.getItem('base')) {
                document.getElementById('base').value = localStorage.getItem('base');
            }
            if (localStorage.getItem('created')) {
                document.getElementById('created').value = localStorage.getItem('created');
            }

            // Set theme based on local storage
            if (localStorage.getItem('theme') === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }

            // Theme toggle button
            document.getElementById('themeToggle').addEventListener('click', () => {
                document.documentElement.classList.toggle('dark');
                if (document.documentElement.classList.contains('dark')) {
                    localStorage.setItem('theme', 'dark');
                } else {
                    localStorage.setItem('theme', 'light');
                }
            });
        });

        function generateUrl() {
            const githubRepo = document.getElementById('github_repo').value;
            const review = document.getElementById('review').value;
            const reviewedBy = document.getElementById('reviewed_by').value;
            const base = document.getElementById('base').value;
            const created = document.getElementById('created').value;

            if (!githubRepo) {
                alert('Please enter a GitHub repository URL.');
                return;
            }

            // Store values in local storage
            localStorage.setItem('github_repo', githubRepo);
            localStorage.setItem('review', review);
            localStorage.setItem('reviewed_by', reviewedBy);
            localStorage.setItem('base', base);
            localStorage.setItem('created', created);

            let query = 'is:pr';
            if (review) query += ` review:${review}`;
            if (reviewedBy) query += ` reviewed-by:${reviewedBy}`;
            if (base) query += ` base:${base}`;
            if (created) query += ` created:${created}`;

            const githubUrl = `${githubRepo}/pulls?q=${encodeURIComponent(query)}`;
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = `<h2 class="text-lg font-bold">Generated URL:</h2><a href="${githubUrl}" target="_blank" class="text-blue-500 underline break-all">${githubUrl}</a>`;
        }

