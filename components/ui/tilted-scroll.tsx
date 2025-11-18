import { cn } from "@/lib/utils"
import { Building2, Users, MessageSquare, Globe, BarChart3 } from "lucide-react"

interface TiltedScrollItem {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  iconClassName: string;
}

interface TiltedScrollProps {
  items?: TiltedScrollItem[];
  className?: string;
}

export function TiltedScroll({ 
  items = defaultItems,
  className 
}: TiltedScrollProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative overflow-hidden [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent,black_5rem),linear-gradient(to_left,transparent,black_5rem),linear-gradient(to_bottom,transparent,black_5rem),linear-gradient(to_top,transparent,black_5rem)]">
        <div className="grid h-[350px] w-[400px] gap-5 animate-skew-scroll grid-cols-1">
          {items.map((item) => (
            <div
              key={item.id}
              className="group flex items-center gap-4 cursor-pointer rounded-md border border-blue-500/20 bg-gradient-to-b from-blue-950/30 to-blue-900/10 p-4 shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${item.iconClassName}`}>
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-white group-hover:text-green-400 transition-colors">
                  {item.title}
                </p>
                <p className="text-xs text-gray-400">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const defaultItems: TiltedScrollItem[] = [
  {
    id: "1",
    title: "Tech Blog Banner",
    description: "2.4% CTR • $12,450 Revenue",
    icon: <Building2 className="h-5 w-5" />,
    iconClassName: "bg-green-500/10 text-green-400"
  },
  {
    id: "2",
    title: "Newsletter Sponsorship",
    description: "1.8% CTR • $8,920 Revenue",
    icon: <Users className="h-5 w-5" />,
    iconClassName: "bg-orange-500/10 text-orange-400"
  },
  {
    id: "3",
    title: "Podcast Ad Campaign",
    description: "1.5% CTR • $6,780 Revenue",
    icon: <MessageSquare className="h-5 w-5" />,
    iconClassName: "bg-blue-500/10 text-blue-400"
  },
  {
    id: "4",
    title: "Social Media Ads",
    description: "2.1% CTR • $5,340 Revenue",
    icon: <Globe className="h-5 w-5" />,
    iconClassName: "bg-purple-500/10 text-purple-400"
  },
  {
    id: "5",
    title: "Display Advertising",
    description: "1.9% CTR • $4,890 Revenue",
    icon: <BarChart3 className="h-5 w-5" />,
    iconClassName: "bg-pink-500/10 text-pink-400"
  }
] 