"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

type CardProps = {
  title: string;
  length: number;
  icon: React.ReactNode;
  path: string;
};

const Card = ({ title, length, icon, path }: CardProps) => {
  return (
    <Link
      href={path}
      className="bg-white rounded-md p-4 shadow min-h-40 group relative flex flex-col justify-between">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-4xl font-semibold">{length}</p>
      <span className="absolute right-[30%] top-4 opacity-20">{icon}</span>
      <ArrowRight
        size={20}
        className="group-hover:translate-x-2 transition-all absolute right-4 bottom-4"
      />
    </Link>
  );
};

export default Card;
