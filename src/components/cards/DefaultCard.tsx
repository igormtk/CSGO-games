import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CardProps = {
  title: string;
  description: string;
  linkTo: string;
  disabled?: boolean;
};

export function DefaultCard({ title, description, linkTo, disabled = false }: CardProps) {
  return (
    <Card className="h-full overflow-hidden border-slate-800 bg-slate-950/80 text-slate-100 shadow-2xl shadow-black/30">
      <CardHeader>
        <CardTitle className="text-3xl font-black">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="min-h-16 text-base leading-7 text-slate-300">{description}</CardDescription>
      </CardContent>
      <CardFooter>
        {disabled ? (
          <Button disabled className="bg-orange-500 text-white hover:bg-orange-600">
            Start
          </Button>
        ) : (
          <Button asChild className="bg-orange-500 text-white hover:bg-orange-600">
            <Link href={linkTo}>Start</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
