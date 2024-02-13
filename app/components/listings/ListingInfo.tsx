"use client";

import { SafeUser } from "@/app/types";
import { IconType } from "react-icons";
import Avatar from "../Avatar";
import ListingCategory from "./ListingCategory";

interface ListingInfoProps {
  user: SafeUser;
  category:
    | {
        icon: IconType;
        label: string;
        description: string;
      }
    | undefined;
  description: string;
  passengerCount: number;
  make: string | null;
  model: string | null;
  year: number | null;
  color: string | null;
}
const ListingInfo: React.FC<ListingInfoProps> = ({
  user,
  category,
  description,
  passengerCount,
  make,
  model,
  year,
  color,
}) => {

  return (
    <div className="col-span-4 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="text-xl font-semibold flex flex-row items-center gap-2">
          <div>Hosted by {user?.name}</div>
          <Avatar src={user?.image} />
        </div>
        <div
          className="
        flex
        flex-row
        gap-4
        items-center
        font-light
        text-neutral-700
        "
        >
          <div>{model}</div>
          <div>{make}</div>
          <div>{year}</div>
        </div>
        <div
          className="
        flex
        flex-row
        gap-4
        items-center
        font-light
        text-neutral-500
        "
        >
          <div>{color}</div>
          <div>{passengerCount} passengers</div>
        </div>

      </div>
      <hr/>
      {category && (
        <ListingCategory
        icon={category.icon}
        label={category.label}
        description={category.description}
        />
      )}
      <hr/>
      <div className="text-lg font-light text-neutral-500">
        {description}
      </div>
      <hr/>
    </div>
  );
};

export default ListingInfo;
