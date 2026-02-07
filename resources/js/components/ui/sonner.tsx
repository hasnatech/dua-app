import {
  CircleCheck,
  Info,
  LoaderCircle,
  OctagonX,
  TriangleAlert,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <>
      <Sonner
        theme={theme as ToasterProps["theme"]}
        className="toaster group"
        icons={{
          success: <CircleCheck className="h-4 w-4" />,
          info: <Info className="h-4 w-4" />,
          warning: <TriangleAlert className="h-4 w-4" />,
          error: <OctagonX className="h-4 w-4" />,
          loading: <LoaderCircle className="h-4 w-4 animate-spin" />,
        }}
        toastOptions={{
          classNames: {
            toast:
              "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
            description: "group-[.toast]:text-muted-foreground",
            actionButton:
              "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
            cancelButton:
              "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          },
        }}
        {...props}
      />
      <style>{`
      [data-sonner-toast][data-type='success'] {
        background: #16a34a !important;
        border-color: #15803d !important;
        color: white !important;
      }
      [data-sonner-toast][data-type='success'] [data-icon] {
        color: white !important;
      }
      [data-sonner-toast][data-type='error'] {
        background: #dc2626 !important;
        border-color: #b91c1c !important;
        color: white !important;
      }
      [data-sonner-toast][data-type='error'] [data-icon] {
        color: white !important;
      }
      [data-sonner-toast][data-type='info'] {
        background: #2563eb !important;
        border-color: #1d4ed8 !important;
        color: white !important;
      }
      [data-sonner-toast][data-type='warning'] {
        background: #ea580c !important;
        border-color: #c2410c !important;
        color: white !important;
      }
    `}</style>
    </>
  )
}

export { Toaster }
