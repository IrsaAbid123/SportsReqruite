import { Listing } from "@/components/ListingCard";

export const mockListings: Listing[] = [
  {
    id: "1",
    title: "Seeking Starting Pitcher for College Team",
    description: "Our college baseball team is looking for a reliable starting pitcher for the upcoming season. We compete in Division II and need someone with strong fundamentals and game experience. Previous college experience preferred but not required. Must be available for weekend games and weekday practice.",
    author: {
      name: "Coach Martinez",
      role: "team",
      avatar: "/placeholder.svg",
      experience: "15+ years coaching",
      location: "Austin, TX"
    },
    status: "available",
    expiryDate: "2024-02-15",
    createdAt: "2024-01-10",
    tags: ["Baseball", "Pitcher", "College", "Division II"],
    requirements: {
      age: "18-22",
      experience: "High School+",
      position: "Pitcher"
    }
  },
  {
    id: "2",
    title: "Experienced Point Guard Available",
    description: "Looking for a competitive team to join for the upcoming basketball season. I have 8 years of experience playing point guard, including 4 years on varsity team. Strong leadership skills and court vision. Available for immediate tryouts and can travel within state.",
    author: {
      name: "Marcus Johnson",
      role: "player",
      avatar: "/placeholder.svg",
      experience: "8 years experience",
      location: "Phoenix, AZ"
    },
    status: "available",
    expiryDate: "2024-03-01",
    createdAt: "2024-01-08",
    tags: ["Basketball", "Point Guard", "Leadership", "Varsity"],
    requirements: {
      experience: "Competitive level",
      position: "Point Guard"
    }
  },
  {
    id: "3",
    title: "Semi-Pro Soccer Team Recruitment",
    description: "Join our semi-professional soccer club! We're building a competitive roster for the regional league. Looking for dedicated players in multiple positions. Regular training schedule, professional coaching staff, and potential for advancement to professional leagues.",
    author: {
      name: "FC Lightning",
      role: "team",
      avatar: "/placeholder.svg",
      experience: "Professional club",
      location: "Miami, FL"
    },
    status: "available",
    expiryDate: "2024-02-20",
    createdAt: "2024-01-05",
    tags: ["Soccer", "Semi-Pro", "Multiple Positions", "Regional League"],
    requirements: {
      age: "18-28",
      experience: "Competitive level"
    }
  },
  {
    id: "4",
    title: "Defensive End - College Scholarship",
    description: "Talented defensive end with varsity experience seeking college opportunities. Strong pass rush skills, excellent work ethic, and team leadership qualities. Interested in programs that value academic achievement alongside athletic excellence.",
    author: {
      name: "Tyler Williams",
      role: "player",
      avatar: "/placeholder.svg",
      experience: "4 years varsity",
      location: "Atlanta, GA"
    },
    status: "filled",
    expiryDate: "2024-01-30",
    createdAt: "2024-01-02",
    tags: ["Football", "Defensive End", "Scholarship", "Academic"],
    requirements: {
      experience: "College level",
      position: "Defensive End"
    }
  },
  {
    id: "5",
    title: "Youth Baseball Coach Position",
    description: "Local youth baseball league seeking enthusiastic coach for ages 10-12 team. Looking for someone with playing experience and passion for teaching fundamentals. Season runs April through July with practices twice weekly. Background check required.",
    author: {
      name: "Riverside Youth League",
      role: "team",
      avatar: "/placeholder.svg",
      experience: "Community organization",
      location: "Portland, OR"
    },
    status: "available",
    expiryDate: "2024-03-15",
    createdAt: "2024-01-12",
    tags: ["Baseball", "Youth Coach", "Teaching", "Community"],
    requirements: {
      age: "21+",
      experience: "Playing background preferred"
    }
  },
  {
    id: "6",
    title: "Volleyball Libero Seeking Team",
    description: "Dedicated libero with extensive defensive skills looking for competitive volleyball team. Specialized in serve receive and defensive positioning. Available for tournaments and league play. Can commit to regular practice schedule.",
    author: {
      name: "Sarah Chen",
      role: "player",
      avatar: "/placeholder.svg",
      experience: "6 years competitive",
      location: "San Diego, CA"
    },
    status: "available",
    expiryDate: "2024-02-28",
    createdAt: "2024-01-11",
    tags: ["Volleyball", "Libero", "Defense", "Tournament"],
    requirements: {
      experience: "Competitive level",
      position: "Libero"
    }
  }
];

export const mockNotifications = [ { id: 1, user: { name: "Sarah Johnson", avatar: "/diverse-woman-portrait.png" }, message: "commented on your profile", timestamp: "2 hours ago", }, { id: 2, user: { name: "Mike Chen", avatar: "/thoughtful-man.png" }, message: "sent you a connection request", timestamp: "4 hours ago", }, { id: 3, user: { name: "Alex Rodriguez", avatar: "/diverse-group-athletes.png" }, message: "liked your recent post", timestamp: "6 hours ago", }, { id: 4, user: { name: "Emma Wilson", avatar: "/motivational-coach.png" }, message: "shared your training video", timestamp: "1 day ago", }, { id: 5, user: { name: "David Park", avatar: "/recruiter-meeting.png" }, message: "viewed your athletic profile", timestamp: "2 days ago", }, ]

export const mockUser = {
  role: "player" as 'player' | 'team' | 'admin',
  avatar: "/placeholder.svg",
  name: "Coach Martinez",
  experience: "15+ years coaching",
  location: "Austin, TX"
};