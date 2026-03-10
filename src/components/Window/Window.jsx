import Draggable from 'react-draggable'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Modular draggable window - GMB-inspired minimal chrome
 * All pages can be opened as separate windows simultaneously
 */
export default function Window({
  id,
  title,
  children,
  defaultPosition = { x: 100, y: 100 },
  defaultSize = { width: 400, height: 500 },
  onClose,
  isMinimized = false,
  zIndex = 1,
  onFocus,
}) {
  return (
    <Draggable
      handle=".window-handle"
      defaultPosition={defaultPosition}
      bounds="parent"
    >
      <motion.div
        className="absolute shadow-2xl rounded-sm overflow-hidden"
        style={{
          width: defaultSize.width,
          height: isMinimized ? 'auto' : defaultSize.height,
          minHeight: isMinimized ? 0 : 200,
          zIndex,
          backgroundColor: '#141414',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        onClick={onFocus}
      >
        {/* Window chrome - minimal GMB style */}
        <div
          className="window-handle flex items-center justify-between px-4 py-2 cursor-grab active:cursor-grabbing border-b"
          style={{
            userSelect: 'none',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '11px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          <span>{title}</span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClose?.(id)
            }}
            className="w-6 h-6 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              className="overflow-auto h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ height: defaultSize.height - 44 }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Draggable>
  )
}
