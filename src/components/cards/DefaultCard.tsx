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
};

export function DefaultCard({
  title,
  description,
  linkTo,
}: CardProps) {
    const disabled = title === 'Daily Skin'
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
      <CardDescription>{description}</CardDescription>
      </CardContent>
      <CardFooter className="flex flex-col item-center">
        <Link href={disabled ? '#' : linkTo}>
          <Button disabled={disabled}>Start</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
