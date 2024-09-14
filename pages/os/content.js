// content.js
const siteContent = {
    title: 'Software That Runs the World!',
    headline: 'Open Source Free Software',
    overview: 'The  operating systems (OS), Database components that run this world!',
    featuredTitle: 'Featured Operating Systems',
    featuredDescription: 'Many of the operating systems, Databases and software we use today are built on the foundational work of pioneers such as Ken Thompson, Dennis Ritchie, Bill Joy, Richard Stallman, Mike Stonebraker and Linus Torvalds.',
    projects: [
      {
        name: 'FreeBSD',
        description: 'FreeBSD is an operating system used to power modern servers, desktops, and embedded platforms.',
        language: 'C, Assembly',
        url: 'https://freebsd.org',
         icon: 'server'
      },
      {
        name: 'Linux Kernel',
        description: 'Linux Kernel is the core of the Linux operating system, powering servers, desktops, and a wide range of devices.',
        language: 'C, Assembly',
        url: 'https://kernel.org'
      },
      {
        name: 'GNU',
        description: "GNU is an operating system that is free software—that is, it respects users' freedom. The GNU operating system consists of GNU packages (programs specifically released by the GNU Project) as well as free software released by third parties. The development of GNU made it possible to use a computer without software that would trample your freedom.",
        language: 'C',
        url: 'https://gnu.org',
        icon: 'cpu' 
      },

      {
        name: 'PostgreSQL',
        description: "The World's Most Advanced Open Source Relational Database",
        language: 'C',
        url: 'https://www.postgresql.org/',
        icon: 'cpu' 
      }
    ]
  };
  
  export default siteContent;