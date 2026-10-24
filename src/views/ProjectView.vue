<template>
  <div class="project-view">
    <div class="project-header">
      <div class="container">
        <h1 class="page-title">{{ t('page.project') }}</h1>
      </div>
    </div>

    <div class="project-content">
      <div class="container">
        <!-- Featured Projects -->
        <div class="featured-projects">
          <div class="projects-grid">
            <a
              v-for="project in featuredProjects"
              :key="project.id"
              :href="project.url || project.githubUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="project-card"
            >
              <div class="card-content">
                <div class="card-header">
                  <h3 class="card-title">
                    {{ project.nameKey ? t(project.nameKey) : project.name }}
                  </h3>
                  <span v-if="project.statusKey" class="status-badge">
                    {{ t(project.statusKey) }}
                  </span>
                </div>
                <p class="card-description">{{ t(project.descriptionKey) }}</p>
                <div class="project-tech">
                  <span v-for="tech in project.technologies" :key="tech" class="tech-tag">
                    {{ tech }}
                  </span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Project {
  id: number
  name?: string
  // 有中日文差異的名稱與描述用 i18n key
  nameKey?: string
  descriptionKey: string
  // 開發中等狀態標籤（i18n key）
  statusKey?: string
  technologies: string[]
  url?: string
  githubUrl?: string
}

// Featured Projects Data
const featuredProjects: Project[] = [
  {
    id: 6,
    name: 'SaaS Admin Console',
    descriptionKey: 'projects.saas.description',
    statusKey: 'projects.status.inProgress',
    technologies: ['Next.js', 'Supabase', 'Tailwind CSS'],
    // 私有 repo，只連到部署網址
    url: 'https://saas-admin-console.vercel.app',
  },
  {
    id: 1,
    name: 'instagram-login-clone',
    descriptionKey: 'projects.instagram.description',
    technologies: ['HTML', 'CSS'],
    url: 'https://ig-clone-pr.netlify.app/',
    githubUrl: 'https://github.com/kenyykd/instagram-login-clone',
  },
  {
    id: 2,
    nameKey: 'projects.wanpai.name',
    descriptionKey: 'projects.wanpai.description',
    technologies: ['Vue', 'Tailwind CSS', 'nodejs', 'express'],
    url: 'https://github.com/wanpai-app/frontend',
    githubUrl: 'https://github.com/wanpai-app/frontend',
  },
  {
    id: 3,
    name: 'inline-net-clone',
    descriptionKey: 'projects.inline.description',
    technologies: ['HTML', 'CSS'],
    url: 'https://inline-net-clone.netlify.app/',
    githubUrl: 'https://github.com/kenyykd/inline-net-clone',
  },
  {
    id: 4,
    name: 'UBike',
    descriptionKey: 'projects.ubike.description',
    technologies: ['next.js'],
    url: 'https://ubike-test.netlify.app/',
    githubUrl: 'https://github.com/kenyykd/ubike',
  },
  {
    id: 5,
    nameKey: 'projects.brick.name',
    descriptionKey: 'projects.brick.description',
    technologies: ['next.js'],
    url: 'https://hit-break.netlify.app/',
    githubUrl: 'https://github.com/kenyykd/hit-brick',
  },
]
</script>

<style scoped>
.project-view {
  min-height: 100vh;
  background: #0a0a0a;
  padding-top: 5rem;
  color: white;
}

.project-header {
  padding: 3rem 0;
}

.project-header .container {
  display: flex;
  justify-content: flex-start;
  max-width: none;
  margin: 0;
  padding-left: 25vw;
  padding-right: 2rem;
}

.page-title {
  font-size: 3rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.9);
  text-align: left;
}

.project-content {
  padding: 2rem 0 4rem 0;
  background: #0a0a0a;
  position: relative;
  overflow: hidden;
}

.project-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.02) 0%, transparent 50%);
  pointer-events: none;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Projects Grid Layout */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

/* Aceternity UI Hover Effect Cards */
.project-card {
  background: #000000;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    transparent 0%,
    rgba(255, 255, 255, 0.03) 50%,
    transparent 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.project-card:hover::before {
  opacity: 1;
}

.project-card:hover {
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.card-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.card-header {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 0.5rem;
  align-items: center;
  margin-bottom: 1rem;
  margin-top: -10px;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.3;
  flex: 0 1 auto;
}

.status-badge {
  display: inline-block;
  padding: 0.1rem 0.45rem;
  background: rgba(29, 185, 84, 0.12);
  color: #1db954;
  border: 1px solid rgba(29, 185, 84, 0.35);
  border-radius: 0.5rem;
  font-size: 0.7rem;
  font-weight: 500;
  line-height: 1.4;
  vertical-align: middle;
  white-space: nowrap;
}

.card-description {
  color: rgba(139, 148, 158, 0.8);
  line-height: 1.6;
  font-size: 0.875rem;
  margin: 0.5rem 0 0 0;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 1rem;
}

.tech-tag {
  padding: 0.25rem 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  border-radius: 0.5rem;
  font-size: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Responsive Design */
@media (max-width: 768px) {
  .project-header .container {
    padding-left: 2rem;
    padding-right: 2rem;
  }

  .page-title {
    font-size: 2.5rem;
  }

  .container {
    padding: 0 1rem;
  }

  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .project-card {
    padding: 1.25rem;
    height: 180px;
  }

  .card-header {
    margin-bottom: 0.75rem;
  }

  .card-title {
    font-size: 1.125rem;
    margin: 0;
  }

  .card-description {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .projects-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .project-card {
    padding: 1rem;
    height: 160px;
  }

  .card-header {
    margin-bottom: 0.5rem;
  }

  .card-title {
    font-size: 1rem;
    margin: 0;
  }

  .card-description {
    font-size: 0.8rem;
  }
}
</style>
