import Image from "next/image";
const FEATURES_MAP = [
  {
    label: "High Speed Wifi",
    description: "High Speed Internet",
    icon: "/assets/images/icons/wifi.svg",
  },
  {
    label: "100% Privacy",
    description: "For Yourself",
    icon: "/assets/images/icons/security-user.svg",
  },
  {
    label: "Free Move",
    description: "Anytime 24/7",
    icon: "/assets/images/icons/group.svg",
  },
  {
    label: "Sustainability",
    description: "Long-term Goals",
    icon: "/assets/images/icons/home-trend-up.svg",
  },
  {
    label: "Parking Space",
    description: "Available",
    icon: "/assets/images/icons/3dcube.svg",
  },
  {
    label: "Compact",
    description: "Good for Focus",
    icon: "/assets/images/icons/coffee.svg",
  },
];

const featureIcons: Record<string, string> = Object.fromEntries(
  FEATURES_MAP.map((feature) => [feature.label, feature.icon])
);

const featureSubtitles: Record<string, string> = Object.fromEntries(
  FEATURES_MAP.map((feature) => [feature.label, feature.description])
);

export default function OfficeFeatures({ features }: { features: string[] }) {
  return (
    <div className="grid grid-cols-3 gap-x-5 gap-y-[30px]">
      {features?.map((feature) => {
        const matched = FEATURES_MAP.find((f) => f.label === feature);
        const icon = matched?.icon || "/assets/images/icons/verify.svg";
        const description = matched?.description || "Feature";

        return (
          <div key={feature} className="flex items-center gap-4">
            <Image
              src={icon}
              className="w-[34px] h-[34px]"
              alt={`${feature} icon`}
              width={34}
              height={34}
              onError={(result) => {
                result.currentSrc = "/assets/images/icons/verify.svg";
              }}
            />
            <div className="flex flex-col gap-[2px]">
              <p className="font-bold text-lg leading-[24px]">{feature}</p>
              <p className="text-sm leading-[21px]">{description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}