
import { getRankedUsers, type RankedUser } from '@/app/actions/users';
import { PageWrapper } from "@/components/shared/PageWrapper";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trophy, Star, Zap } from "lucide-react";

export default async function RankingPage() {
  const rankedUsers: RankedUser[] = await getRankedUsers();

  return (
    <PageWrapper className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold flex items-center">
          <Trophy className="mr-3 h-8 w-8 text-primary text-glow-primary" />
          Crypton Nexus <span className="text-primary text-glow-primary ml-2">Leaderboard</span>
        </h1>
      </div>

      {rankedUsers.length > 0 ? (
        <div className="frosted-glass rounded-lg shadow-xl overflow-hidden border border-border/30">
          <Table>
            <TableCaption className="py-4">Top miners on the Crypton Nexus network.</TableCaption>
            <TableHeader>
              <TableRow className="border-b-border/50 hover:bg-transparent">
                <TableHead className="w-[100px] text-center text-muted-foreground font-semibold">Rank</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Username</TableHead>
                <TableHead className="text-right text-muted-foreground font-semibold">Points</TableHead>
                <TableHead className="text-center text-muted-foreground font-semibold">Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankedUsers.map((user) => (
                <TableRow key={user.id} className="border-b-border/20 hover:bg-primary/10 last:border-b-0">
                  <TableCell className="font-bold text-lg text-center">
                    <div className="flex items-center justify-center">
                      {user.rank === 1 && <Trophy className="h-6 w-6 mr-2 text-yellow-400" />}
                      {user.rank === 2 && <Trophy className="h-5 w-5 mr-2 text-slate-400" />}
                      {user.rank === 3 && <Trophy className="h-5 w-5 mr-2 text-orange-400" />}
                      <span className={user.rank <=3 ? 'text-glow-primary': ''}>{user.rank}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-foreground/90">{user.username}</TableCell>
                  <TableCell className="text-right text-foreground/90">
                    <Zap className="inline-block h-4 w-4 mr-1.5 text-yellow-500" />
                    {user.points.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center text-foreground/90">
                     <Star className="inline-block h-4 w-4 mr-1.5 text-accent" />
                    {user.level}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-16 frosted-glass rounded-lg border border-border/30">
          <Trophy className="mx-auto h-16 w-16 text-muted-foreground/50 mb-6" />
          <h3 className="text-2xl font-semibold mb-3">Leaderboard is Charting Its Course</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            No miners have been ranked yet, or the data streams are still aligning.
            Engage in PoW tasks to etch your name among the stars!
          </p>
        </div>
      )}
    </PageWrapper>
  );
}
