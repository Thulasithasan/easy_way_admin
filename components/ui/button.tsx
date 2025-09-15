import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Archive, CheckCircle, Loader2, PackageCheck, Pencil, Save, ShoppingCart, XCircle } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        success: "bg-success text-white hover:bg-success-700",
        danger: "bg-danger text-white hover:bg-danger-700",
        warning: "bg-warning text-black hover:bg-warning-600",
        info: "bg-info text-white hover:bg-info-700",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: "save" | "update" | "activate" | "deactivate" | "archive" | "cart" | "order" | "default";
}

const loadingConfig = {
  save: {
    icon: <Save className="h-4 w-4 mr-2 animate-bounce" />,
    text: "Saving...",
  },
  update: {
    icon: <Pencil className="h-4 w-4 mr-2 animate-bounce" />,
    text: "Updating...",
  },
  activate: {
    icon: <CheckCircle className="h-4 w-4 mr-2 animate-bounce" />,
    text: "Activating...",
  },
  deactivate: {
    icon: <XCircle className="h-4 w-4 mr-2 animate-bounce" />,
    text: "Deactivating...",
  },
  archive: {
    icon: <Archive className="h-4 w-4 mr-2 animate-bounce" />,
    text: "Archiving...",
  },
  cart: {
    icon: <ShoppingCart className="h-4 w-4 mr-2 animate-bounce" />,
    text: "Adding to cart...",
  },
  order: {
    icon: <PackageCheck className="h-4 w-4 mr-2 animate-bounce" />,
    text: "Placing order...",
  },
  default: {
    icon: <Loader2 className="h-4 w-4 mr-2 animate-spin" />,
    text: "Loading...",
  },
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      loadingText = "default",
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const config = loadingConfig[loadingText] || loadingConfig.default;

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          loading && "cursor-not-allowed opacity-70"
        )}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          // <>
          //   <svg
          //     className="animate-spin h-4 w-4 mr-2 text-current"
          //     xmlns="http://www.w3.org/2000/svg"
          //     fill="none"
          //     viewBox="0 0 24 24"
          //   >
          //     <circle
          //       className="opacity-25"
          //       cx="12"
          //       cy="12"
          //       r="10"
          //       stroke="currentColor"
          //       strokeWidth="4"
          //     />
          //     <path
          //       className="opacity-75"
          //       fill="currentColor"
          //       d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z"
          //     />
          //   </svg>
          //   Loading...
          // </>
          <>
            {config.icon}
            {config.text}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
